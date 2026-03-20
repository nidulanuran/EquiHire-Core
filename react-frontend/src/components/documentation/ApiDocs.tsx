import { EquiHireLogo } from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Terminal, Shield, Database } from "lucide-react";

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2 border-l pl-4">
              <EquiHireLogo className="w-6 h-6" />
              <span className="font-bold text-lg tracking-tight">EquiHire Docs</span>
            </div>
          </div>
          <nav className="text-sm font-medium space-x-4">
            <a href="/documentation/guide" className="text-muted-foreground hover:text-primary transition-colors">User Guide</a>
            <a href="/documentation/api" className="text-primary font-semibold">API Reference</a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 flex-1 flex flex-col md:flex-row gap-8 py-8 lg:py-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground">API Reference</h3>
            <div className="flex flex-col space-y-2">
              <a href="#authentication" className="text-sm font-medium text-primary bg-primary/10 px-3 py-2 rounded-md">Authentication</a>
              <a href="#endpoints" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 transition-colors">Core Endpoints</a>
              <a href="#models" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 transition-colors">Data Models</a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl space-y-12">
          <section className="space-y-4">
            <div className="inline-flex items-center space-x-2 text-primary font-medium mb-2">
              <Terminal className="h-5 w-5" />
              <span>API Documentation</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">REST API Reference</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Integrate EquiHire directly into your HR stack. Our REST API allows you to programmatically
              manage jobs, candidates, and retrieve AI screening analytics.
            </p>
          </section>

          <hr className="border-border" />

          <section id="authentication" className="space-y-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-foreground" />
              <h2 className="text-2xl font-semibold tracking-tight">Authentication</h2>
            </div>
            <p className="text-muted-foreground">
              All API requests require a valid Bearer token from Asgardeo in the Authorization header.
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto border">
              <code>Authorization: Bearer &lt;YOUR_ACCESS_TOKEN&gt;</code>
            </div>
          </section>

          <section id="endpoints" className="space-y-8">
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-foreground" />
              <h2 className="text-2xl font-semibold tracking-tight">Core Endpoints</h2>
            </div>

            {/* Endpoint 1 */}
            <div className="border rounded-xl overflow-hidden bg-card">
              <div className="bg-muted/50 px-4 py-3 border-b flex items-center space-x-3">
                <span className="font-bold text-xs uppercase tracking-widest text-[#FF7300] bg-[#FF7300]/10 px-2 py-1 rounded">GET</span>
                <code className="font-mono text-sm font-semibold">/api/v1/jobs</code>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-muted-foreground text-sm">Retrieves a list of all active job postings for your organization.</p>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Response Example</h4>
                  <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg text-xs overflow-x-auto shadow-inner">
{`{
  "data": [
    {
      "id": "job_123",
      "title": "Senior Software Engineer",
      "department": "Engineering",
      "status": "published"
    }
  ],
  "meta": { "total": 1 }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Endpoint 2 */}
            <div className="border rounded-xl overflow-hidden bg-card">
              <div className="bg-muted/50 px-4 py-3 border-b flex items-center space-x-3">
                <span className="font-bold text-xs uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-1 rounded">POST</span>
                <code className="font-mono text-sm font-semibold">/api/v1/candidates</code>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-muted-foreground text-sm">Creates a new candidate and triggers the AI screening workflow.</p>
              </div>
            </div>

          </section>

          <footer className="pt-12 text-sm text-muted-foreground">
            <p>API requests are rate limited to 100 requests per minute.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
