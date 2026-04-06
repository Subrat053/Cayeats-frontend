import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content, className = "" }) => {
  // Split content by H2 to create sections
  const sections = content.split(/(?=^## )/m);

  return (
    <div className={`markdown-content space-y-8 ${className}`}>
      {sections.map((section, index) => {
        const isFirstSection = index === 0 && !section.trim().startsWith("##");

        return isFirstSection ? (
          // First section might be intro content (before first H2)
          <ReactMarkdown
            key={index}
            remarkPlugins={[remarkGfm]}
            components={getComponents()}
          >
            {section}
          </ReactMarkdown>
        ) : (
          // Subsequent sections wrapped in styled boxes
          <div
            key={index}
            className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 md:p-8 hover:border-gray-600 transition-colors"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={getComponents()}
            >
              {section}
            </ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
};

function getComponents() {
  return {
    // H1: Main title with premium styling
    h1: ({ node, ...props }) => (
      <div className="mb-8 mt-0">
        <h1
          className="text-5xl md:text-6xl font-bold text-white mb-3 leading-tight"
          {...props}
        />
        <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
      </div>
    ),

    // H2: Section headings - clean and bold
    h2: ({ node, ...props }) => (
      <h2
        className="text-3xl font-bold text-white mb-4 flex items-center gap-3"
        {...props}
      >
        <span className="h-1 w-1 bg-orange-500 rounded-full"></span>
      </h2>
    ),

    // H3: Subsection headings with orange accent
    h3: ({ node, ...props }) => (
      <h3 className="text-2xl font-bold text-white mb-4 mt-6" {...props} />
    ),

    // H4: Small headings in orange
    h4: ({ node, ...props }) => (
      <h4 className="text-xl font-bold text-orange-400 mb-3 mt-4" {...props} />
    ),

    // Paragraphs with better spacing
    p: ({ node, ...props }) => (
      <p className="text-gray-300 leading-relaxed mb-4 text-base" {...props} />
    ),

    // Unordered lists with custom styling
    ul: ({ node, ...props }) => (
      <ul className="space-y-3 mb-6 text-gray-300 ml-4" {...props} />
    ),

    // Ordered lists with custom styling
    ol: ({ node, ...props }) => (
      <ol className="space-y-3 mb-6 text-gray-300 ml-4" {...props} />
    ),

    // List items with custom bullets/styling
    li: ({ node, ...props }) => (
      <li className="flex gap-3 text-gray-300 leading-relaxed">
        <span className="text-orange-400 font-bold mt-0.5 flex-shrink-0">
          •
        </span>
        <span {...props} />
      </li>
    ),

    // Blockquotes with premium styling
    blockquote: ({ node, ...props }) => (
      <blockquote
        className="border-l-4 border-orange-500 bg-gray-900/50 pl-6 pr-4 py-4 my-6 rounded-r-lg italic text-gray-300"
        {...props}
      />
    ),

    // Inline code with styling
    code: ({ node, inline, ...props }) =>
      inline ? (
        <code
          className="bg-gray-900 text-orange-400 px-3 py-1 rounded text-sm font-mono"
          {...props}
        />
      ) : (
        <pre className="block bg-gray-900 text-orange-400 p-4 rounded-lg mb-6 overflow-x-auto border border-gray-700">
          <code {...props} />
        </pre>
      ),

    // Code blocks
    pre: ({ node, ...props }) => (
      <pre
        className="bg-gray-900 text-orange-400 p-4 rounded-lg mb-6 overflow-x-auto border border-gray-700"
        {...props}
      />
    ),

    // Links with hover effect
    a: ({ node, ...props }) => (
      <a
        className="text-orange-400 hover:text-orange-300 underline hover:underline-offset-2 transition-colors"
        {...props}
      />
    ),

    // Tables with premium styling
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto mb-6 border border-gray-700 rounded-lg">
        <table className="w-full border-collapse" {...props} />
      </div>
    ),

    // Table headers
    th: ({ node, ...props }) => (
      <th
        className="border border-gray-700 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-3 text-left font-semibold"
        {...props}
      />
    ),

    // Table cells
    td: ({ node, ...props }) => (
      <td className="border border-gray-700 text-gray-300 p-3" {...props} />
    ),
  };
}

export default MarkdownRenderer;
