"use client"

import { useState } from "react"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { Lightbulb, FileText, HelpCircle, Scale } from "lucide-react"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/tiptap-ui-primitive/dropdown-menu"
import { Card, CardBody } from "@/components/tiptap-ui-primitive/card"

export type NoteType = "Idea" | "Summary" | "Question" | "Argument" | "Note"

const NoteTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case "Idea": return <Lightbulb size={14} className="mr-2 text-yellow-500" />
        case "Summary": return <FileText size={14} className="mr-2 text-blue-500" />
        case "Question": return <HelpCircle size={14} className="mr-2 text-orange-500" />
        case "Argument": return <Scale size={14} className="mr-2 text-red-500" />
        default: return <FileText size={14} className="mr-2 text-gray-400" />
    }
}

export const NoteTypeDropdown = ({
    type = "Note",
    onChange
}: {
    type?: string,
    onChange: (type: NoteType) => void
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const types: NoteType[] = ["Note", "Idea", "Summary", "Question", "Argument"]

    return (
        <DropdownMenu modal open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button data-style="ghost" className="h-8 gap-1 px-2 hover:bg-[var(--vscode-list-hover)]">
                    <NoteTypeIcon type={type} />
                    <span className="text-xs font-medium text-[var(--foreground)] opacity-80">{type}</span>
                    <ChevronDownIcon className="tiptap-button-dropdown-small ml-1 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <Card>
                    <CardBody className="p-1 flex flex-col gap-0.5 min-w-[140px]">
                        {types.map(t => (
                            <DropdownMenuItem key={t} asChild>
                                <Button
                                    data-style="ghost"
                                    onClick={() => onChange(t)}
                                    className="justify-start w-full h-8 px-2 font-normal"
                                >
                                    <NoteTypeIcon type={t} />
                                    <span className="text-sm">{t}</span>
                                </Button>
                            </DropdownMenuItem>
                        ))}
                    </CardBody>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
