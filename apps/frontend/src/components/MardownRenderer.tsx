import ReactMarkdown from "react-markdown"
import hljs from "highlight.js"
import "highlight.js/styles/atom-one-dark.css"

interface Props {
  markdown: string
}


export default function MarkdownRenderer({ markdown }: Props) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          const lang = match?.[1]

          if (lang) {
            const html = hljs.highlight(String(children), {
              language: lang,
              ignoreIllegals: true,
            }).value

            return (
              <pre className="hljs p-4 rounded-md overflow-x-auto">
                <code dangerouslySetInnerHTML={{ __html: html }} />
              </pre>
            )
          }

          return (
            <code className="bg-muted px-1 py-0.5 rounded" {...props}>
              {children}
            </code>
          )
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}