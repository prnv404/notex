import * as React from "react"
import {
    Files,
    Search,
    GitGraph,
    Play,
    LayoutGrid,
    Settings,
    User,
    ChevronRight,
    ChevronDown,
    File as FileIcon,
    Folder,
    Plus,
    FilePlus,
    FolderPlus,
    Trash2
} from "lucide-react"
import { cn } from "@/lib/tiptap-utils"
import { TreeNode } from "@/lib/types/node"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { DeleteDialog } from "@/components/DeleteDialog"
import { UserProfile } from "@/components/UserProfile"
import { InlineInput } from "@/components/InlineInput"

interface AppSidebarProps {
    tree: TreeNode[]
    activeTab: string
    setActiveTab: (tab: string) => void
    selectedNodeId: string | null
    onSelectNode: (id: string) => void
    onCreateNode: (type: 'folder' | 'note', title: string, parentId?: string | null) => Promise<any>
    onDeleteNode: (id: string) => Promise<boolean>
}

const FileTreeItem = ({
    node,
    depth = 0,
    selectedNodeId,
    onSelectNode,
    onCreateNode,
    onDeleteNode,
    creatingNode,
    onCancelCreate,
    onStartCreate
}: {
    node: TreeNode;
    depth?: number;
    selectedNodeId: string | null;
    onSelectNode: (id: string) => void;
    onCreateNode: (type: 'folder' | 'note', title: string, parentId?: string | null) => Promise<any>;
    onDeleteNode: (id: string) => Promise<boolean>;
    creatingNode: { type: 'folder' | 'note'; parentId: string } | null;
    onCancelCreate: () => void;
    onStartCreate: (type: 'folder' | 'note', parentId: string) => void;
}) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    const [deleteDialog, setDeleteDialog] = React.useState<{
        isOpen: boolean
        nodeId: string | null
        nodeTitle: string
    }>({ isOpen: false, nodeId: null, nodeTitle: '' })

    const handleCreateNote = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(true)
        onStartCreate('note', node.id)
    }

    const handleCreateFolder = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(true)
        onStartCreate('folder', node.id)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDeleteDialog({ isOpen: true, nodeId: node.id, nodeTitle: node.title })
    }

    const handleDeleteConfirm = async () => {
        if (deleteDialog.nodeId) {
            await onDeleteNode(deleteDialog.nodeId)
        }
    }

    const handleInlineCreate = async (title: string) => {
        if (creatingNode) {
            await onCreateNode(creatingNode.type, title, creatingNode.parentId)
            onCancelCreate()
        }
    }

    const isCreatingHere = creatingNode?.parentId === node.id

    return (
        <div>
            <div
                className={cn(
                    "group flex items-center py-1 px-2 cursor-pointer hover:bg-[var(--vscode-list-hover)] text-[var(--foreground)]",
                    node.id === selectedNodeId && "bg-[var(--vscode-list-active)] text-[var(--vscode-list-active-foreground)]"
                )}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={() => {
                    if (node.type === "folder") {
                        setIsOpen(!isOpen)
                    } else {
                        onSelectNode(node.id)
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <span className="mr-1 opacity-70 shrink-0">
                    {node.type === "folder" ? (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : (
                        <span className="w-3.5 inline-block" />
                    )}
                </span>

                <span className="mr-1.5 text-blue-400 shrink-0">
                    {node.type === "folder" ? (
                        null
                    ) : (
                        <FileIcon size={14} />
                    )}
                </span>

                <span className="text-sm truncate flex-1 select-none">{node.title}</span>

                {/* Always visible actions with spacing */}
                <div className="flex items-center gap-1.5 opacity-100 transition-opacity">
                    {node.type === 'folder' && (
                        <>
                            <FilePlus size={14} className="hover:text-blue-500 cursor-pointer" onClick={handleCreateNote} />
                            <FolderPlus size={14} className="hover:text-blue-500 cursor-pointer" onClick={handleCreateFolder} />
                        </>
                    )}
                    <Trash2 size={14} className="hover:text-red-500 cursor-pointer" onClick={handleDelete} />
                </div>
            </div>

            {node.type === "folder" && isOpen && (
                <div>
                    {isCreatingHere && creatingNode && (
                        <InlineInput
                            type={creatingNode.type}
                            depth={depth + 1}
                            onSubmit={handleInlineCreate}
                            onCancel={onCancelCreate}
                        />
                    )}
                    {node.children && node.children.map((child) => (
                        <FileTreeItem
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            selectedNodeId={selectedNodeId}
                            onSelectNode={onSelectNode}
                            onCreateNode={onCreateNode}
                            onDeleteNode={onDeleteNode}
                            creatingNode={creatingNode}
                            onCancelCreate={onCancelCreate}
                            onStartCreate={onStartCreate}
                        />
                    ))}
                </div>
            )}

            <DeleteDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={handleDeleteConfirm}
                itemName={deleteDialog.nodeTitle}
            />
        </div>
    )
}

export function AppSidebar({
    tree,
    activeTab,
    setActiveTab,
    selectedNodeId,
    onSelectNode,
    onCreateNode,
    onDeleteNode
}: AppSidebarProps) {
    const [creatingNode, setCreatingNode] = React.useState<{
        type: 'folder' | 'note'
        parentId: string
    } | null>(null)

    const handleStartCreate = (type: 'folder' | 'note', parentId: string) => {
        setCreatingNode({ type, parentId })
    }

    const handleCancelCreate = () => {
        setCreatingNode(null)
    }

    const handleRootCreate = async (title: string) => {
        if (creatingNode) {
            await onCreateNode(creatingNode.type, title, null)
            setCreatingNode(null)
        }
    }

    const isCreatingRoot = creatingNode?.parentId === 'root'

    return (
        <div className="flex h-full select-none">
            {/* Sidebar */}
            <div className="w-64 bg-[var(--vscode-sidebar-bg)] border-r border-[var(--vscode-border)] flex flex-col h-full">
                <div className="h-9 px-4 flex items-center justify-between text-xs font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
                    <span>NOTEX</span>
                    <div className="flex gap-1.5 opacity-100 transition-opacity">
                        <div
                            className="cursor-pointer hover:text-[var(--foreground)]"
                            title="New File"
                            onClick={() => handleStartCreate('note', 'root')}
                        >
                            <FilePlus size={16} />
                        </div>
                        <div
                            className="cursor-pointer hover:text-[var(--foreground)]"
                            title="New Folder"
                            onClick={() => handleStartCreate('folder', 'root')}
                        >
                            <FolderPlus size={16} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto py-2">
                    {isCreatingRoot && creatingNode && (
                        <InlineInput
                            type={creatingNode.type}
                            depth={0}
                            onSubmit={handleRootCreate}
                            onCancel={handleCancelCreate}
                        />
                    )}
                    {tree.map((node) => (
                        <FileTreeItem
                            key={node.id}
                            node={node}
                            selectedNodeId={selectedNodeId}
                            onSelectNode={onSelectNode}
                            onCreateNode={onCreateNode}
                            onDeleteNode={onDeleteNode}
                            creatingNode={creatingNode}
                            onCancelCreate={handleCancelCreate}
                            onStartCreate={handleStartCreate}
                        />
                    ))}
                    {tree.length === 0 && !isCreatingRoot && (
                        <div className="p-4 text-xs text-[var(--muted-foreground)] text-center">
                            No files. Create one to get started.
                        </div>
                    )}
                </div>

                <UserProfile />
            </div>
        </div>
    )
}
