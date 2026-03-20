import { EquiHireLogo } from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Settings, Users, Zap } from "lucide-react";

export default function UserGuide() {
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
            <a href="/documentation/guide" className="text-primary font-semibold">User Guide</a>
            <a href="/documentation/api" className="text-muted-foreground hover:text-primary transition-colors">API Reference</a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 flex-1 flex flex-col md:flex-row gap-8 py-8 lg:py-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground">Getting Started</h3>
            <div className="flex flex-col space-y-2">
              <a href="#introduction" className="text-sm font-medium text-primary bg-primary/10 px-3 py-2 rounded-md">Introduction</a>
              <a href="#quickstart" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 transition-colors">Quick Start</a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground">Core Concepts</h3>
            <div className="flex flex-col space-y-2">
              <a href="#organizations" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 transition-colors">Organizations</a>
              <a href="#ai-screening" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 transition-colors">AI Screening</a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl space-y-12">
          <section id="introduction" className="space-y-4">
            <div className="inline-flex items-center space-x-2 text-primary font-medium mb-2">
              <BookOpen className="h-5 w-5" />
              <span>User Guide</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome to EquiHire</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              EquiHire is your modern, AI-powered recruitment platform designed to eliminate bias
              and streamline the hiring process. This guide provides an overview of how to get
              the most out of your workspace.
            </p>
          </section>

          <hr className="border-border" />

          <section id="quickstart" className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">Quick Start</h2>
            <div className="grid gap-6">
              <div className="p-6 border rounded-xl bg-card shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Settings className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-medium">1. Set up your Organization</h3>
                <p className="text-muted-foreground">
                  Login with Asgardeo and follow the onboarding wizard to define your company profile, branding, and initial team members.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-medium">2. Create a Job Posting</h3>
                <p className="text-muted-foreground">
                  Navigate to the Dashboard and click <strong>Create Job</strong>. Our AI will help you craft inclusive job descriptions automatically.
                </p>
              </div>

              <div className="p-6 border rounded-xl bg-card shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-medium">3. Invite Candidates</h3>
                <p className="text-muted-foreground">
                  Share your unique job link. EquiHire handles resume parsing, AI screening, and initial scoring out of the box.
                </p>
              </div>
            </div>
          </section>

          <footer className="pt-12 text-sm text-muted-foreground">
            <p>Need more help? Check out the <a href="/documentation/api" className="text-primary hover:underline">API Reference</a> or contact support.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
