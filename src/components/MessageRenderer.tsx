/**
 * 📝 MESSAGE RENDERER COMPONENT
 * 
 * 🎯 WHAT IS THIS?
 * This component displays chat messages with fancy formatting!
 * Think of it as a "Message Beautifier" - it makes text look pretty!
 * 
 * 🎨 WHAT IT DOES:
 * - Shows regular text nicely formatted
 * - Renders Markdown (bold, italic, lists, etc.)
 * - Displays code blocks with syntax highlighting
 * - Adds "Copy" button to code blocks
 * - Makes links clickable
 * - Shows tables, lists, and more!
 * 
 * 🛠️ SPECIAL FEATURES:
 * - Code highlighting (colors for different programming languages)
 * - Copy to clipboard (click to copy code)
 * - GitHub-style formatting
 * - Supports HTML in markdown
 * 
 * 📊 PROPS:
 * - content: The message text (can include Markdown)
 * - role: Who sent it? ('user', 'assistant', or 'system')
 * 
 * 💭 THINK OF IT LIKE:
 * A magic paintbrush that turns plain text into beautiful,
 * colorful messages with code blocks and formatting!
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

// 📋 COMPONENT PROPS - What this component needs
interface MessageRendererProps {
  content: string;  // 📝 The message text
  role: 'user' | 'assistant' | 'system';  // 👤 Who sent it?
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ content, role }) => {
  // 🎨 LOCAL STATE
  const [copiedCode, setCopiedCode] = useState<string | null>(null);  // 📋 Which code was copied?

  /**
   * 📋 COPY TO CLIPBOARD - Copy code when button is clicked
   * Like pressing Ctrl+C to copy text!
   */
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);  // 📋 Copy to clipboard
    setCopiedCode(id);  // ✅ Mark as copied
    setTimeout(() => setCopiedCode(null), 2000);  // ⏰ Clear after 2 seconds
  };

  return (
    <div style={styles.messageContent}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

            if (!inline && match) {
              return (
                <div style={styles.codeBlockContainer}>
                  <div style={styles.codeBlockHeader}>
                    <span style={styles.codeLanguage}>{match[1]}</span>
                    <button
                      style={{
                        ...styles.copyButton,
                        ...(copiedCode === codeId ? styles.copyButtonCopied : {}),
                      }}
                      onClick={() => copyToClipboard(codeString, codeId)}
                    >
                      {copiedCode === codeId ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <pre style={styles.codeBlock}>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }

            return (
              <code style={styles.inlineCode} {...props}>
                {children}
              </code>
            );
          },
          pre({ children }: any) {
            return <>{children}</>;
          },
          p({ children }: any) {
            return <p style={styles.paragraph}>{children}</p>;
          },
          h1({ children }: any) {
            return <h1 style={styles.h1}>{children}</h1>;
          },
          h2({ children }: any) {
            return <h2 style={styles.h2}>{children}</h2>;
          },
          h3({ children }: any) {
            return <h3 style={styles.h3}>{children}</h3>;
          },
          ul({ children }: any) {
            return <ul style={styles.ul}>{children}</ul>;
          },
          ol({ children }: any) {
            return <ol style={styles.ol}>{children}</ol>;
          },
          li({ children }: any) {
            return <li style={styles.li}>{children}</li>;
          },
          blockquote({ children }: any) {
            return <blockquote style={styles.blockquote}>{children}</blockquote>;
          },
          a({ href, children }: any) {
            return (
              <a href={href} style={styles.link} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          table({ children }: any) {
            return <table style={styles.table}>{children}</table>;
          },
          thead({ children }: any) {
            return <thead style={styles.thead}>{children}</thead>;
          },
          tbody({ children }: any) {
            return <tbody>{children}</tbody>;
          },
          tr({ children }: any) {
            return <tr style={styles.tr}>{children}</tr>;
          },
          th({ children }: any) {
            return <th style={styles.th}>{children}</th>;
          },
          td({ children }: any) {
            return <td style={styles.td}>{children}</td>;
          },
          strong({ children }: any) {
            return <strong style={styles.strong}>{children}</strong>;
          },
          em({ children }: any) {
            return <em style={styles.em}>{children}</em>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  messageContent: {
    lineHeight: '1.6',
    color: '#e1e4e8',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  paragraph: {
    margin: '0 0 12px 0',
    lineHeight: '1.6',
  },
  h1: {
    fontSize: '24px',
    fontWeight: '600',
    margin: '16px 0 12px 0',
    color: '#ffffff',
    borderBottom: '1px solid #30363d',
    paddingBottom: '8px',
  },
  h2: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '16px 0 12px 0',
    color: '#ffffff',
    borderBottom: '1px solid #30363d',
    paddingBottom: '6px',
  },
  h3: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '12px 0 8px 0',
    color: '#ffffff',
  },
  ul: {
    margin: '0 0 12px 0',
    paddingLeft: '24px',
  },
  ol: {
    margin: '0 0 12px 0',
    paddingLeft: '24px',
  },
  li: {
    margin: '4px 0',
  },
  blockquote: {
    margin: '0 0 12px 0',
    padding: '8px 16px',
    borderLeft: '4px solid #58a6ff',
    backgroundColor: 'rgba(88, 166, 255, 0.1)',
    color: '#c9d1d9',
  },
  link: {
    color: '#58a6ff',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  inlineCode: {
    backgroundColor: 'rgba(110, 118, 129, 0.4)',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '13px',
    fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
    color: '#e6edf3',
  },
  codeBlockContainer: {
    margin: '12px 0',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#161b22',
    border: '1px solid #30363d',
  },
  codeBlockHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#0d1117',
    borderBottom: '1px solid #30363d',
  },
  codeLanguage: {
    fontSize: '12px',
    color: '#8b949e',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
  },
  copyButton: {
    backgroundColor: '#21262d',
    color: '#c9d1d9',
    border: '1px solid #30363d',
    borderRadius: '4px',
    padding: '4px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  copyButtonCopied: {
    backgroundColor: '#238636',
    borderColor: '#238636',
    color: '#ffffff',
  },
  codeBlock: {
    margin: '0',
    padding: '16px',
    backgroundColor: '#161b22',
    overflow: 'auto',
    fontSize: '13px',
    lineHeight: '1.6',
    fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    margin: '12px 0',
    fontSize: '14px',
  },
  thead: {
    backgroundColor: '#161b22',
  },
  tr: {
    borderTop: '1px solid #30363d',
  },
  th: {
    padding: '8px 12px',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid #30363d',
    color: '#e6edf3',
  },
  td: {
    padding: '8px 12px',
    borderBottom: '1px solid #30363d',
    color: '#c9d1d9',
  },
  strong: {
    fontWeight: '600',
    color: '#ffffff',
  },
  em: {
    fontStyle: 'italic',
    color: '#c9d1d9',
  },
};

export default MessageRenderer;
