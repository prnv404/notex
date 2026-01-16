import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { CustomImageNode } from "./image-node"

export interface CustomImageOptions {
    inline: boolean
    allowBase64: boolean
    HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        customImage: {
            setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType
        }
    }
}

export const CustomImage = Node.create<CustomImageOptions>({
    name: 'image',

    addOptions() {
        return {
            inline: false,
            allowBase64: false,
            HTMLAttributes: {},
        }
    },

    inline() {
        return this.options.inline
    },

    group() {
        return this.options.inline ? 'inline' : 'block'
    },

    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: this.options.allowBase64
                    ? 'img[src]'
                    : 'img[src]:not([src^="data:"])',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    },

    addCommands() {
        return {
            setImage: (options) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                })
            },
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(CustomImageNode)
    },
})

export default CustomImage
