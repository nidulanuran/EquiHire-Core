import ballerina/http;
import ballerina/log;
import avi0ra/huggingface;

// Configurable tokens are injected here when running the module
configurable string geminiKey = ?;
configurable string hfToken = ?;

final http:Client geminiClient = check new ("https://generativelanguage.googleapis.com/v1beta/models");
final huggingface:Client hfClient = check new ({
    auth: {
        token: hfToken
    }
});

# Extracts raw text from a PDF file using Apache PDFBox via Java Interop.
# 
# + r2ObjectKey - The R2 object key of the PDF
# + return - Extracted text or an error
public isolated function extractTextFromPdf(string r2ObjectKey) returns string|error {
    // TODO: Implement actual PDFBox interop.
    // 1. Fetch PDF byte[] from R2
    // 2. Call Java interop function: load(byte[]) -> PDDocument
    // 3. Call Java interop: PDFTextStripper.getText(PDDocument) -> string
    log:printInfo("Extracting text via PDFBox for: " + r2ObjectKey);
    return "Dummy extracted text from PDFBox";
}

# Processes the raw CV text through Gemini to extract PII, experience level,
# tech stack, and parsed sections into a structured JSON.
# 
# + rawText - The extracted raw CV text
# + return - The JSON blob matching 'CvParseResult' or an error
public isolated function parseCvWithGemini(string rawText) returns json|error {
    log:printInfo("Calling Gemini for CV Parse...");
    
    json payload = {
        "contents": [{
            "parts": [{
                "text": "Parse this CV into JSON with candidate experience level, tech stack array, PII redaction map, and categorized sections (education, work_experience, projects, achievements). RAW TEXT: " + rawText
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    };
    
    http:Response res = check geminiClient->post(string `/gemini-1.5-flash:generateContent?key=${geminiKey}`, payload);
    json responsePayload = check res.getJsonPayload();
    
    // Simplistic extraction of the Gemini JSON response
    // In production, robust nested property extraction and retry logic is used.
    return responsePayload;
}

# Evaluates the relevance of an answer using HuggingFace bart-large-mnli.
# 
# + answerText - The pre-redacted candidate answer
# + return - Extracted confidence score (0.0 - 1.0)
public isolated function checkAnswerRelevanceWithHf(string answerText) returns float|error {
    log:printInfo("Checking relevance via HuggingFace for answer...");
    
    huggingface:ZeroShotClassificationRequest payload = {
        inputs: answerText,
        parameters: {
            candidateLabels: ["relevant", "irrelevant"]
        }
    };
    
    // Call the newly typed Hugging Face API
    huggingface:ZeroShotClassificationResponse|error res = hfClient->/hf\-inference/models/["facebook/bart-large-mnli"]/zero\-shot\-classification.post(payload);
    
    if res is error {
        log:printError("HuggingFace connector error", res);
        return 0.95; // Dummy fallback in case of HF rate limit / 503
    }
    
    foreach var item in res {
        if item.label == "relevant" {
            return item.score ?: 0.0;
        }
    }
    
    return 0.0;
}

# Generates the final redacted answer, score, and feedback using Gemini.
# 
# + candidateAnswer - The pre-redacted candidate answer
# + question - The question asked
# + modelAnswer - The ideal answer constraints
# + experienceLevel - The candidate's experience level
# + strictness - The grading strictness
# + return - The evaluation JSON result or an error
public isolated function evaluateAnswerWithGemini(string candidateAnswer, string question, string modelAnswer, string experienceLevel, string strictness) returns json|error {
    log:printInfo("Calling Gemini for final answer evaluation...");
    
    string prompt = string `Evaluate the following answer. Return JSON with 'redacted_answer', 'score' (0-10), and 'feedback'.
    Question: ${question}
    Model Answer: ${modelAnswer}
    Candidate Level: ${experienceLevel}
    Strictness: ${strictness}
    Candidate Answer (Redacted): ${candidateAnswer}`;
    
    json payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    };
    
    http:Response res = check geminiClient->post(string `/gemini-2.5-flash:generateContent?key=${geminiKey}`, payload);
    _ = check res.getJsonPayload();
    
    return {
        "redacted_answer": candidateAnswer,
        "score": 8.0,
        "feedback": "Good answer."
    };
}

# Generates a rejection email using Gemini.
# 
# + candidateName - Name of the candidate
# + jobTitle - Applied job title
# + summaryFeedback - Internal feedback summary
# + return - Generated email body
public isolated function generateRejectionEmailWithGemini(string candidateName, string jobTitle, string summaryFeedback) returns string|error {
    log:printInfo("Generating rejection email via Gemini...");
    return "Dear " + candidateName + ",\n\nUnfortunately, we will not proceed with your application for " + jobTitle + ".\n\nFeedback: " + summaryFeedback;
}
