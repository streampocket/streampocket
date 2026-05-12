import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

const schema = {
  ...defaultSchema,
  tagNames: (defaultSchema.tagNames ?? []).filter(
    (t) => t !== 'img' && t !== 'video' && t !== 'iframe' && t !== 'audio',
  ),
}

type Props = {
  content: string
}

export function MarkdownRenderer({ content }: Props) {
  return (
    <div className="prose prose-sm max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, schema]]}
        components={{
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer nofollow ugc">
              {children}
            </a>
          ),
          img: () => null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
