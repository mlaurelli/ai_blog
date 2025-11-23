'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Typography from '@tiptap/extension-typography';
import { createLowlight, common } from 'lowlight';
import { useCallback, useEffect, useState } from 'react';
import ImagePicker from './ImagePicker';

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
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [sourceContent, setSourceContent] = useState('');
  
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration issues
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
        heading: {
          levels: [1, 2, 3],
        },
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
          class: 'max-w-full h-auto rounded-lg my-4',
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
        class: 'prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:my-3 prose-ul:my-4 prose-ol:my-4 prose-li:my-1',
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

  const handleImageSelect = useCallback((url: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url }).run();
    setShowImagePicker(false);
  }, [editor]);

  const toggleSource = useCallback(() => {
    if (!editor) return;
    
    if (!showSource) {
      // Switch to source view
      setSourceContent(editor.getHTML());
      setShowSource(true);
    } else {
      // Switch back to editor view
      editor.commands.setContent(sourceContent);
      onChange(sourceContent);
      setShowSource(false);
    }
  }, [editor, showSource, sourceContent, onChange]);

  if (!editor) {
    return (
      <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <div className="p-4 text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {/* Toolbar */}
      {editable && (
        <div className="border-b-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3">
          <div className="flex flex-wrap gap-1 items-center">
          {/* Text formatting */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed ${
              editor?.isActive('bold') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            B
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors italic disabled:opacity-50 disabled:cursor-not-allowed ${
              editor.isActive('italic') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            I
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors line-through disabled:opacity-50 disabled:cursor-not-allowed ${
              editor.isActive('strike') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Strikethrough"
          >
            S
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
              editor.isActive('code') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Inline code"
          >
            {'</>'}
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold text-lg ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Heading 1 (largest) - Select text or place cursor on line"
          >
            H1
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold text-base ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Heading 2 (medium) - Select text or place cursor on line"
          >
            H2
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold text-sm ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Heading 3 (small) - Select text or place cursor on line"
          >
            H3
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Bullet list - Click then start typing. Press Enter for new items"
          >
            • List
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Numbered list - Click then start typing. Press Enter for new items"
          >
            1. List
          </button>

          <button
            type="button"
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
            type="button"
            onClick={setLink}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('link') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Add link"
          >
            🔗 Link
          </button>

          <button
            type="button"
            onClick={() => setShowImagePicker(true)}
            className="px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Add image - Upload or search Unsplash"
          >
            🖼️ Image
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Other */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive('blockquote') ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="Quote"
          >
            ❝ Quote
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Horizontal rule"
          >
            ― HR
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Undo/Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>

          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* View Source */}
          <button
            type="button"
            onClick={toggleSource}
            className={`px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-mono text-xs ${
              showSource ? 'bg-gray-300 dark:bg-gray-600' : ''
            }`}
            title="View/Edit HTML Source"
          >
            {'<> HTML'}
          </button>

          {/* Clear formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            className="px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
            title="Clear all formatting"
          >
            ✖ Clear
          </button>
          </div>
        </div>
      )}

      {/* Editor content or source view */}
      {showSource ? (
        <textarea
          value={sourceContent}
          onChange={(e) => setSourceContent(e.target.value)}
          className="w-full min-h-[400px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none border-none resize-y"
          placeholder="HTML source code..."
        />
      ) : (
        <EditorContent editor={editor} />
      )}
      
      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold">Add Image</h3>
              <button
                type="button"
                onClick={() => setShowImagePicker(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <ImagePicker
                value=""
                onChange={handleImageSelect}
                title="Editor Image"
                excerpt=""
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
