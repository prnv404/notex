'use client'

import { createClient } from '@/lib/supabase/client'
import { Node, TreeNode } from '@/lib/types/node'
import { useEffect, useState } from 'react'

export function useNodes() {
    const [nodes, setNodes] = useState<Node[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchNodes = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('nodes')
            .select('*')
            .order('position', { ascending: true })

        if (error) {
            console.error('Error fetching nodes:', error)
        } else {
            setNodes(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchNodes()

        // Subscribe to real-time changes
        const channel = supabase
            .channel('nodes-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'nodes',
                },
                () => {
                    fetchNodes()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const createNode = async (
        type: 'folder' | 'note',
        title: string,
        parentId: string | null = null
    ) => {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return null

        // Get max position for siblings
        const { data: siblings } = await supabase
            .from('nodes')
            .select('position')
            .eq('parent_id', parentId || 'null')
            .order('position', { ascending: false })
            .limit(1)

        const position = siblings && siblings.length > 0 ? siblings[0].position + 1 : 0

        const { data, error } = await supabase
            .from('nodes')
            .insert({
                user_id: userData.user.id,
                parent_id: parentId,
                type,
                title,
                content: type === 'note' ? {} : null,
                position,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating node:', error)
            return null
        }

        return data
    }

    const updateNode = async (id: string, updates: Partial<Node>) => {
        const { error } = await supabase.from('nodes').update(updates).eq('id', id)

        if (error) {
            console.error('Error updating node:', error)
            return false
        }

        return true
    }

    const deleteNode = async (id: string) => {
        const { error } = await supabase.from('nodes').delete().eq('id', id)

        if (error) {
            console.error('Error deleting node:', error)
            return false
        }

        return true
    }

    const buildTree = (parentId: string | null = null): TreeNode[] => {
        return nodes
            .filter((node) => node.parent_id === parentId)
            .sort((a, b) => {
                // Sort folders first, then files
                if (a.type === 'folder' && b.type !== 'folder') return -1
                if (a.type !== 'folder' && b.type === 'folder') return 1
                // Within same type, sort by position then title
                if (a.position !== b.position) return a.position - b.position
                return a.title.localeCompare(b.title)
            })
            .map((node) => ({
                ...node,
                children: buildTree(node.id),
            }))
    }

    return {
        nodes,
        tree: buildTree(),
        loading,
        createNode,
        updateNode,
        deleteNode,
        refresh: fetchNodes,
    }
}
