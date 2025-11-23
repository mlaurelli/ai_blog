'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Typography from '@tiptap/extension-typography';
import { createLowlight, common } from 'lowlight';
import { useCallback, useEffect } from 'react';

// Create lowlight instance
const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Start writing...',
  editable = true 
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration issues
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto',
        },
      }),
      Typography,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    
    const url = window.prompt('Image URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {/* Toolbar */}
      {editable && (
        <div className="border-b-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 flex flex-wrap gap-1">
          {/* Text formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold ${
              editor.isActive('bold') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            B
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors italic ${
              editor.isActive('italic') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            I
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors line-through ${
              editor.isActive('strike') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Strikethrough"
          >
            S
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-mono text-sm ${
              editor.isActive('code') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Inline code"
          >
            {'</>'}
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Headings */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Heading 1"
          >
            H1
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Heading 2"
          >
            H2
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Heading 3"
          >
            H3
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Bullet list"
          >
            • List
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Numbered list"
          >
            1. List
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-mono text-sm ${
              editor.isActive('codeBlock') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Code block"
          >
            {'{ }'}
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Links and Images */}
          <button
            onClick={setLink}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('link') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Add link"
          >
            🔗 Link
          </button>

          <button
            onClick={addImage}
            className="px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Add image"
          >
            🖼️ Image
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Other */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('blockquote') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Quote"
          >
            ❝ Quote
          </button>

          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Horizontal rule"
          >
            ― HR
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Undo/Redo */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
        </div>
      )}

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}
