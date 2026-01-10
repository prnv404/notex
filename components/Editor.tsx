'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { useEffect } from 'react'

interface EditorProps {
    content: any
    onChange: (content: any) => void
    title: string
    onTitleChange: (title: string) => void
}

export function Editor({ content, onChange, title, onTitleChange }: EditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Highlight,
            Typography,
            Image,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Subscript,
            Superscript,
            HorizontalRule,
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON())
        },
        editorProps: {
            attributes: {
                class:
                    'prose prose-invert max-w-none focus:outline-none h-full px-12 py-8',
            },
        },
    })


    useEffect(() => {
        if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    if (!editor) {
        return null
    }

    return (
        <div className="flex h-full flex-col bg-zinc-900">
            {/* Toolbar */}
            <div className="flex items-center gap-1 border-b border-zinc-700 px-4 py-2">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`rounded p-2 hover:bg-zinc-800 ${editor.isActive('bold') ? 'bg-zinc-700 text-white' : 'text-zinc-400'
                        }`}
                    title="Bold"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`rounded p-2 hover:bg-zinc-800 ${editor.isActive('italic') ? 'bg-zinc-700 text-white' : 'text-zinc-400'
                        }`}
                    title="Italic"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 4h4M14 4l-4 16M6 20h4"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`rounded p-2 hover:bg-zinc-800 ${editor.isActive('strike') ? 'bg-zinc-700 text-white' : 'text-zinc-400'
                        }`}
                    title="Strikethrough"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12h18M9 5l-2 14M17 5l-2 14"
                        />
                    </svg>
                </button>

                <div className="mx-2 h-6 w-px bg-zinc-700" />

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`rounded px-3 py-2 text-sm font-semibold hover:bg-zinc-800 ${editor.isActive('heading', { level: 1 })
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400'
                        }`}
                    title="Heading 1"
                >
                    H1
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`rounded px-3 py-2 text-sm font-semibold hover:bg-zinc-800 ${editor.isActive('heading', { level: 2 })
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400'
                        }`}
                    title="Heading 2"
                >
                    H2
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`rounded px-3 py-2 text-sm font-semibold hover:bg-zinc-800 ${editor.isActive('heading', { level: 3 })
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400'
                        }`}
                    title="Heading 3"
                >
                    H3
                </button>

                <div className="mx-2 h-6 w-px bg-zinc-700" />

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`rounded p-2 hover:bg-zinc-800 ${editor.isActive('bulletList') ? 'bg-zinc-700 text-white' : 'text-zinc-400'
                        }`}
                    title="Bullet List"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`rounded p-2 hover:bg-zinc-800 ${editor.isActive('orderedList') ? 'bg-zinc-700 text-white' : 'text-zinc-400'
                        }`}
                    title="Numbered List"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4h1v5H3V4zm0 7h1v5H3v-5zm0 7h1v2H3v-2zM7 6h14M7 12h14M7 18h14"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`rounded p-2 hover:bg-zinc-800 ${editor.isActive('codeBlock') ? 'bg-zinc-700 text-white' : 'text-zinc-400'
                        }`}
                    title="Code Block"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={`rounded p-2 hover:bg-zinc-800 ${editor.isActive('highlight') ? 'bg-zinc-700 text-white' : 'text-zinc-400'
                        }`}
                    title="Highlight"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                    </svg>
                </button>

                <div className="mx-2 h-6 w-px bg-zinc-700" />

                <button
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="rounded p-2 text-zinc-400 hover:bg-zinc-800"
                    title="Horizontal Rule"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="rounded p-2 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30"
                    title="Undo"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="rounded p-2 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30"
                    title="Redo"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                        />
                    </svg>
                </button>
            </div>

            {/* Title */}
            <div className="border-b border-zinc-700 px-12 py-6">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="w-full bg-transparent text-4xl font-bold text-white outline-none placeholder:text-zinc-600"
                    placeholder="Untitled"
                />
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
