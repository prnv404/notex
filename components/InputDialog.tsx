"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/tiptap-utils"

interface InputDialogProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (value: string) => void
    title: string
    placeholder?: string
    defaultValue?: string
}

export function InputDialog({
    isOpen,
    onClose,
    onSubmit,
    title,
    placeholder = "",
    defaultValue = ""
}: InputDialogProps) {
    const [value, setValue] = React.useState(defaultValue)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (isOpen) {
            setValue(defaultValue)
            setTimeout(() => inputRef.current?.focus(), 0)
        }
    }, [isOpen, defaultValue])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (value.trim()) {
            onSubmit(value.trim())
            setValue("")
            onClose()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--vscode-border)] flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[var(--foreground)]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 bg-[var(--vscode-sidebar-bg)] border border-[var(--vscode-border)] rounded text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-sm text-[var(--foreground)] hover:bg-[var(--vscode-list-hover)] rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!value.trim()}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
