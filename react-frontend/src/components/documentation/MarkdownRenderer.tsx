
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="w-full markdown-body text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-10 mb-6 first:mt-0 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-12 mb-6 border-b pb-4 border-border/50 text-foreground" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight mt-8 mb-4 text-foreground/90" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-medium mt-6 mb-3 text-muted-foreground" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside ml-6 mb-6 space-y-3 text-muted-foreground" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside ml-6 mb-6 space-y-3 text-muted-foreground" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed pl-1 marker:text-primary/50" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="relative border-l-4 border-primary pl-6 py-4 my-8 rounded-r-2xl bg-gradient-to-r from-primary/10 to-transparent italic text-foreground/80 font-medium" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-border/60 my-12" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-8 rounded-2xl border border-border/50 bg-card/50 shadow-sm backdrop-blur-sm">
              <table className="w-full text-sm text-left" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="text-xs uppercase bg-muted/50 border-b border-border/50 text-muted-foreground" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-6 py-4 font-semibold tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-6 py-4 border-b border-border/30 bg-background/30" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isBlock = !inline && match;
            if (isBlock) {
              return (
                <div className="relative mb-8 mt-4 rounded-2xl overflow-hidden border border-zinc-800 bg-[#0c0c0e] shadow-2xl">
                  <div className="flex items-center px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    {match?.[1] && (
                      <div className="ml-auto text-zinc-500 text-xs font-mono lowercase">
                        {match[1]}
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto p-5">
                   <code className="text-sm font-mono text-zinc-300 font-medium leading-relaxed" {...props}>
                      {children}
                   </code>
                  </div>
                </div>
              );
            }
            return (
              <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-sm font-mono border border-primary/20" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, children, ...props }) => (
              <pre className="!bg-transparent !p-0 !m-0" {...props}>{children}</pre>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
