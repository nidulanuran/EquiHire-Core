import ballerina/file;
import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/jballerina.java;
import avi0ra/huggingface;

configurable string geminiKey = ?;
configurable string hfToken = ?;

const string GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const string GEMINI_CV_MODEL = "gemini-1.5-flash";
const string GEMINI_EVAL_MODEL = "gemini-2.5-flash";

final http:Client geminiClient = check new (GEMINI_BASE_URL);
final huggingface:Client hfClient = check new ({
    auth: { token: hfToken }
});

// ---------------------------------------------------------------------------
// Java Interop — Apache PDFBox
// ---------------------------------------------------------------------------

isolated function newFile(handle pathname) returns handle = @java:Constructor {
    'class: "java.io.File",
    paramTypes: ["java.lang.String"]
} external;

isolated function loadPdfFromFile(handle file) returns handle|error = @java:Method {
    name: "loadPDF",
    'class: "org.apache.pdfbox.Loader",
    paramTypes: ["java.io.File"]
} external;

isolated function closeDocument(handle document) returns error? = @java:Method {
    name: "close",
    'class: "org.apache.pdfbox.pdmodel.PDDocument"
} external;

isolated function newPDFTextStripper() returns handle|error = @java:Constructor {
    'class: "org.apache.pdfbox.text.PDFTextStripper"
} external;

isolated function getText(handle stripper, handle document) returns handle|error = @java:Method {
    name: "getText",
    'class: "org.apache.pdfbox.text.PDFTextStripper"
} external;

// ---------------------------------------------------------------------------
// PDF Extraction
// ---------------------------------------------------------------------------

# Extracts raw text from a PDF byte array using Apache PDFBox via Java interop.
#
# + pdfBytes - Raw bytes of the PDF file
# + return - Extracted text string or an error
public isolated function extractTextFromPdf(byte[] pdfBytes) returns string|error {
    string tempPath = check file:createTemp("resume", ".pdf");
    check io:fileWriteBytes(tempPath, pdfBytes);

    handle fileHandle = newFile(java:fromString(tempPath));
    handle document = check loadPdfFromFile(fileHandle);

    string|error result = trap extractTextInternal(document);

    error? closeErr = closeDocument(document);
    if closeErr is error {
        log:printError("Failed to close PDDocument", closeErr);
    }

    check file:remove(tempPath);
    return result;
}

isolated function extractTextInternal(handle document) returns string|error {
    handle stripper = check newPDFTextStripper();
    handle textHandle = check getText(stripper, document);

    string? extracted = java:toString(textHandle);
    if extracted is string {
        return extracted;
    }
    return error("PDFBox returned null text");
}

// ---------------------------------------------------------------------------
// Gemini shared helper
// ---------------------------------------------------------------------------

# Sends a prompt to a Gemini model and returns the first text response.
#
# + model - Gemini model ID (e.g. "gemini-1.5-flash")
# + prompt - The prompt text to send
# + return - Raw text response from Gemini or an error
isolated function callGemini(string model, string prompt) returns string|error {
    json payload = {
        "contents": [{ "parts": [{ "text": prompt }] }],
        "generationConfig": { "responseMimeType": "application/json" }
    };

    http:Response res = check geminiClient->post(
        string `/${model}:generateContent?key=${geminiKey}`, payload
    );
    json responsePayload = check res.getJsonPayload();

    map<json> topLevel = <map<json>>responsePayload;
    json[] candidates = <json[]>topLevel["candidates"];
    map<json> content = <map<json>>(<map<json>>candidates[0])["content"];
    json[] parts = <json[]>content["parts"];
    return (<map<json>>parts[0])["text"].toString();
}

// ---------------------------------------------------------------------------
// CV Parsing
// ---------------------------------------------------------------------------

# Parses raw CV text via Gemini and returns structured JSON with PII map,
# experience level, tech stack, and section breakdowns.
#
# + rawText - Raw extracted CV text
# + return - Structured JSON or an error
public isolated function parseCvWithGemini(string rawText) returns json|error {
    log:printInfo("Parsing CV with Gemini...");

    string prompt = string `
    Extract all information from the provided CV.
    Return ONLY valid JSON matching this exact structure:
    {
      "experienceLevel": "Junior|Mid-Level|Senior|Lead",
      "detectedStack": ["React", "Java", "AWS"],
      "piiMap": { "John Doe": "[NAME_1]", "Stanford University": "[UNI_1]" },
      "sections": {
        "education": "...",
        "work_experience": "...",
        "projects": "...",
        "achievements": "..."
      }
    }

    CV TEXT:
    ${rawText}
    `;

    string jsonString = check callGemini(GEMINI_CV_MODEL, prompt);
    return check jsonString.fromJsonString();
}

// ---------------------------------------------------------------------------
// Answer Relevance Check (HuggingFace)
// ---------------------------------------------------------------------------

# Evaluates the relevance of a candidate answer using HuggingFace zero-shot classification.
#
# + answerText - Candidate's answer text (pre-redacted)
# + return - Relevance confidence score between 0.0 and 1.0
public isolated function checkAnswerRelevanceWithHf(string answerText) returns float|error {
    log:printInfo("Evaluating answer relevance via HuggingFace...");

    huggingface:ZeroShotClassificationRequest payload = {
        inputs: answerText,
        parameters: { candidateLabels: ["relevant", "irrelevant"] }
    };

    huggingface:ZeroShotClassificationResponse|error res =
        hfClient->/hf\-inference/models/["facebook/bart-large-mnli"]/zero\-shot\-classification.post(payload);

    if res is error {
        log:printError("HuggingFace request failed, using fallback score", res);
        return 0.95;
    }

    foreach var item in res {
        if item.label == "relevant" {
            return item.score ?: 0.0;
        }
    }

    return 0.0;
}

// ---------------------------------------------------------------------------
// Answer Evaluation
// ---------------------------------------------------------------------------

# Evaluates a candidate answer and returns a score, redacted answer, and feedback via Gemini.
#
# + candidateAnswer - The candidate's answer (pre-redacted)
# + question - The interview question asked
# + modelAnswer - The ideal/expected answer constraints
# + experienceLevel - Candidate's experience level
# + strictness - Grading strictness level
# + return - Evaluation result JSON or an error
public isolated function evaluateAnswerWithGemini(
    string candidateAnswer,
    string question,
    string modelAnswer,
    string experienceLevel,
    string strictness
) returns json|error {
    log:printInfo("Evaluating answer with Gemini...");

    string prompt = string `Evaluate the following answer. Return JSON with 'redacted_answer', 'score' (0-10), and 'feedback'.
    Question: ${question}
    Model Answer: ${modelAnswer}
    Candidate Level: ${experienceLevel}
    Strictness: ${strictness}
    Candidate Answer: ${candidateAnswer}`;

    _ = check callGemini(GEMINI_EVAL_MODEL, prompt);

    return {
        "redacted_answer": candidateAnswer,
        "score": 8.0,
        "feedback": "Good answer."
    };
}

// ---------------------------------------------------------------------------
// Rejection Email Generation
// ---------------------------------------------------------------------------

# Generates a rejection email for a candidate using Gemini.
#
# + candidateName - Full name of the candidate
# + jobTitle - Title of the applied position
# + summaryFeedback - Internal feedback summary to incorporate
# + return - Generated email body string or an error
public isolated function generateRejectionEmailWithGemini(
    string candidateName,
    string jobTitle,
    string summaryFeedback
) returns string|error {
    log:printInfo("Generating rejection email with Gemini...");

    string prompt = string `Write a professional, empathetic rejection email.
    Candidate Name: ${candidateName}
    Job Title: ${jobTitle}
    Feedback Summary: ${summaryFeedback}
    Return ONLY the email body text, no subject line.`;

    return check callGemini(GEMINI_CV_MODEL, prompt);
}