"use client"

import { useState } from "react"
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react"
import { Trash2 } from "lucide-react"

export const CustomImageNode = (props: NodeViewProps) => {
    const [isHovered, setIsHovered] = useState(false)
    const { node, getPos, editor, selected } = props

    const handleDelete = () => {
        const pos = getPos()
        if (typeof pos === 'number') {
            editor
                .chain()
                .deleteRange({ from: pos, to: pos + node.nodeSize })
                .run()
        }
    }

    const showControls = isHovered || selected

    return (
        <NodeViewWrapper
            className="custom-image-node-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`custom-image-container ${selected ? 'selected' : ''}`}>
                <img
                    src={node.attrs.src}
                    alt={node.attrs.alt || ''}
                    title={node.attrs.title || ''}
                    className="custom-image"
                    draggable="false"
                />

                {showControls && (
                    <div className="custom-image-controls">
                        <button
                            onClick={handleDelete}
                            className="custom-image-delete-btn"
                            title="Delete image"
                            type="button"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}
