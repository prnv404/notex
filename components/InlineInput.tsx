"use client"

import * as React from "react"
import { FileIcon, Folder } from "lucide-react"

interface InlineInputProps {
    type: 'folder' | 'note'
    depth: number
    onSubmit: (value: string) => void
    onCancel: () => void
}

export function InlineInput({ type, depth, onSubmit, onCancel }: InlineInputProps) {
    const [value, setValue] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
    }, [])

    const handleSubmit = () => {
        if (value.trim()) {
            onSubmit(value.trim())
            setValue("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleSubmit()
        } else if (e.key === "Escape") {
            e.preventDefault()
            onCancel()
        }
    }

    const handleBlur = () => {
        if (value.trim()) {
            handleSubmit()
        } else {
            onCancel()
        }
    }

    return (
        <div
            className="flex items-center py-1 px-2 bg-[var(--vscode-list-hover)]"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
            <span className="mr-1 opacity-70 shrink-0 w-3.5" />

            <span className="mr-1.5 text-blue-400 shrink-0">
                {type === "folder" ? <Folder size={14} /> : <FileIcon size={14} />}
            </span>

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none border-b border-blue-500"
                placeholder={`New ${type}...`}
            />
        </div>
    )
}
