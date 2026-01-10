"use client"

import * as React from "react"
import { AlertTriangle, X } from "lucide-react"

interface DeleteDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    itemName: string
}

export function DeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    itemName
}: DeleteDialogProps) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose()
        } else if (e.key === "Enter") {
            handleConfirm()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
            <div
                className="bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                onKeyDown={handleKeyDown}
                tabIndex={-1}
            >
                <div className="px-4 py-3 border-b border-[var(--vscode-border)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        <h3 className="text-sm font-medium text-[var(--foreground)]">Delete Item</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-sm text-[var(--foreground)] mb-4">
                        Are you sure you want to delete <span className="font-semibold text-red-400">"{itemName}"</span>?
                        <br />
                        <span className="text-[var(--muted-foreground)] text-xs mt-1 inline-block">
                            This action cannot be undone.
                        </span>
                    </p>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-sm text-[var(--foreground)] hover:bg-[var(--vscode-list-hover)] rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
