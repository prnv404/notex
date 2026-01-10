export type NodeType = 'folder' | 'note'

export interface Node {
    id: string
    user_id: string
    parent_id: string | null
    type: NodeType
    title: string
    content: any | null
    position: number
    created_at: string
    updated_at: string
}

export interface TreeNode extends Node {
    children?: TreeNode[]
    isExpanded?: boolean
}
