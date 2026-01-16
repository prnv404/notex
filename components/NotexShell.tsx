"use client"

import { useState, useCallback, useEffect } from "react"
import { AppSidebar } from "./AppSidebar"
import { SimpleEditor } from "./tiptap/editor"
import { useNodes } from "@/lib/hooks/useNodes"


export function NotexShell() {
    const { nodes, tree, loading, createNode, updateNode, deleteNode } = useNodes()
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<string>("files")

    const selectedNode = nodes.find(n => n.id === selectedNodeId)

    const handleSelectNode = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId)
        if (node?.type === 'note') {
            setSelectedNodeId(nodeId)
        }
    }

    const handleUpdateContent = useCallback(async (content: JSON) => {
        if (selectedNodeId) {
            await updateNode(selectedNodeId, { content })
        }
    }, [selectedNodeId, updateNode])

    // Simple render for now
    return (
        <main className="flex h-screen w-full bg-[var(--background)] overflow-hidden">
            <AppSidebar
                tree={tree}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedNodeId={selectedNodeId}
                onSelectNode={handleSelectNode}
                onCreateNode={createNode}
                onDeleteNode={deleteNode}
            />

            <div className="flex-1 h-full overflow-hidden bg-[var(--vscode-bg)] flex flex-col">
                {selectedNode ? (
                    <SimpleEditor
                        key={selectedNode.id} // Force re-mount on node change to reset editor state easily
                        initialContent={selectedNode.content}
                        onUpdate={(content) => handleUpdateContent(content as any)}
                        fileName={selectedNode.title}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--muted-foreground)]">
                        <div className="text-4xl mb-4 font-light opacity-20">NOTEX</div>
                        <p>Select a note to view or edit</p>
                    </div>
                )}
            </div>
        </main>
    )
}
