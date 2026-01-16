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

    // Helper to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (days === 0) return "Today"
        if (days === 1) return "Yesterday"
        if (days < 7) return `${days}d ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div>
            <div
                className={cn(
                    "group relative flex items-center py-1.5 px-3 mx-2 rounded-r-md cursor-pointer transition-all duration-150 ease-out select-none border-l-[3px]",
                    // Selection Style: Thin accent bar + subtle tint
                    node.id === selectedNodeId
                        ? "bg-[var(--vscode-list-active)] border-[var(--primary)] text-[var(--vscode-list-active-foreground)]"
                        : "border-transparent hover:bg-[var(--vscode-list-hover)]"
                )}
                style={{
                    paddingLeft: `${depth * 16 + 12}px`,
                }}
                onClick={(e) => {
                    // Prevent triggering if clicking on actions
                    e.stopPropagation();
                    if (node.type === "folder") {
                        setIsOpen(!isOpen)
                    } else {
                        onSelectNode(node.id)
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* No indent guide in Apple Notes usually, kept clean */}

                <span
                    className="mr-2 opacity-80 shrink-0 transition-transform duration-200 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-0.5 rounded-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (node.type === "folder") setIsOpen(!isOpen);
                    }}
                >
                    {node.type === "folder" ? (
                        <ChevronRight size={14} className={cn("transition-transform duration-200", isOpen && "rotate-90")} />
                    ) : (
                        <span className="w-3.5 inline-block" />
                    )}
                </span>

                <span className="mr-3 shrink-0">
                    {node.type === "folder" ? (
                        <Folder size={18} className={cn("fill-current", isOpen ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]")} />
                    ) : (
                        <FileIcon size={16} className="text-[var(--muted-foreground)]" />
                    )}
                </span>

                <span className={cn(
                    "text-[13px] truncate flex-1 leading-none py-0.5",
                    node.id === selectedNodeId ? "font-medium" : "font-normal text-[var(--foreground)] opacity-90"
                )}>{node.title}</span>

                {/* Metadata & Actions - visible on hover */}
                <div className="flex items-center gap-3">
                    {/* Metadata: Last Edited / Type */}
                    <span className={cn(
                        "text-[10px] text-[var(--muted-foreground)] transition-opacity duration-200 uppercase tracking-wider font-medium",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}>
                        {node.type === 'note' ? formatDate(node.updated_at) : ''}
                    </span>

                    {/* Actions */}
                    <div className={cn(
                        "flex items-center gap-2 transition-opacity duration-200",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}>
                        {node.type === 'folder' && (
                            <>
                                <div className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer" onClick={handleCreateNote} title="New Note">
                                    <FilePlus size={14} />
                                </div>
                                <div className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer" onClick={handleCreateFolder} title="New Folder">
                                    <FolderPlus size={14} />
                                </div>
                            </>
                        )}
                        <div className="text-[var(--muted-foreground)] hover:text-red-500 cursor-pointer" onClick={handleDelete} title="Delete">
                            <Trash2 size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {node.type === "folder" && isOpen && (
                <div className="relative">
                    {/* Optional connection line */}
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
            <div className="w-64 bg-[var(--vscode-sidebar-bg)]/80 backdrop-blur-xl border-r border-[var(--vscode-border)] flex flex-col h-full text-[13px] font-medium">
                {/* Apple Notes Header Style */}
                <div className="h-14 px-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-[var(--foreground)] tracking-tight">NOTEX</span>
                    <div className="flex gap-3">
                        <div
                            className="cursor-pointer text-[var(--vscode-activity-bar-fg)] hover:opacity-70 transition-opacity"
                            title="New Folder"
                            onClick={() => handleStartCreate('folder', 'root')}
                        >
                            <FolderPlus size={20} />
                        </div>
                        <div
                            className="cursor-pointer text-[var(--vscode-activity-bar-fg)] hover:opacity-70 transition-opacity"
                            title="New Note"
                            onClick={() => handleStartCreate('note', 'root')}
                        >
                            <FilePlus size={20} />
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
