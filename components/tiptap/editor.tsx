"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { CustomImage } from "@/components/tiptap-node/image-node/image-node-extension"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import Placeholder from "@tiptap/extension-placeholder"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import { NoteTypeDropdown } from "@/components/tiptap-ui/note-type-dropdown"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"
import { Share } from "lucide-react"

// --- Components ---
import { ShareModal } from "@/components/ShareModal"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap/editor.scss"

import content from "@/components/tiptap/data/content.json"

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  noteType,
  setNoteType,
  showOutline,
  setShowOutline,
  onShareClick
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
  noteType: any
  setNoteType: (type: any) => void
  showOutline: boolean
  setShowOutline: (show: boolean) => void
  onShareClick: () => void
}) => {
  return (
    <>
      <Spacer />

      <ToolbarSeparator />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={true} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={true}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      <ToolbarGroup className="mr-10 gap-2">

        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 h-8 gap-2 shadow-sm transition-all font-medium !bg-green-600 !text-white rounded-none"
          onClick={onShareClick}
        >
          <Share size={14} />
          <span className="text-xs">Share</span>
        </Button>
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export interface SimpleEditorProps {
  initialContent?: any
  onUpdate?: (content: any) => void
  fileName?: string
}

export function SimpleEditor({ initialContent, onUpdate, fileName }: SimpleEditorProps) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const [noteType, setNoteType] = useState("Note")
  const [showOutline, setShowOutline] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const toolbarRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        paragraph: {
          HTMLAttributes: {
            class: 'paragraph-node',
          },
        },
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      Placeholder.configure({
        placeholder: "What are you thinking about?",
        emptyEditorClass: "is-editor-empty",
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      CustomImage,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: initialContent || content,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON())
    }
  })

  useEffect(() => {
    if (editor && initialContent) {
      // We only set content if it's different to prevent cursor jumping or loops
      // But for switching files, we likely want to force set.
      // The key prop on SimpleEditor in NotexShell handles the "switching files" case by re-mounting.
      // So here we might not need to do anything complex.
    }
  }, [initialContent, editor])

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  return (
    <div className="simple-editor-wrapper flex flex-col h-full bg-[var(--vscode-bg)]">
      {/* File Name Header (Optional but good for context) */}
      {/* <div className="px-12 py-2 text-sm text-[var(--muted-foreground)] border-b border-[var(--border)]">
         {fileName}
      </div> */}

      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                bottom: `calc(100% - ${height - rect.y}px)`,
              }
              : {}),
          }}
          className="border-b border-[var(--vscode-border)] bg-[var(--vscode-bg)]/80 backdrop-blur-md sticky top-0 z-10 shadow-sm"
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              noteType={noteType}
              setNoteType={setNoteType}
              showOutline={showOutline}
              setShowOutline={setShowOutline}
              onShareClick={() => setShowShareModal(true)}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <div className="flex-1 overflow-y-auto relative">
          {showOutline ? (
            <div className="absolute inset-0 bg-[var(--vscode-bg)] z-20 p-8">
              <h2 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Outline</h2>
              <div className="space-y-2 border-l-2 border-[var(--border)] ml-2 pl-4">
                {/* Mock Outline */}
                <div className="text-sm font-medium">Introduction</div>
                <div className="text-sm text-[var(--muted-foreground)] ml-2">Key Concepts</div>
                <div className="text-sm font-medium">Main Argument</div>
                <div className="text-sm text-[var(--muted-foreground)] ml-2">Evidence A</div>
                <div className="text-sm text-[var(--muted-foreground)] ml-2">Evidence B</div>
                <div className="text-sm font-medium">Conclusion</div>
              </div>
            </div>
          ) : (
            <>
              {/* Apple Notes Date Header */}
              <div className="text-center text-[var(--muted-foreground)] text-xs font-medium py-6 select-none opacity-60">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>

              <EditorContent
                editor={editor}
                role="presentation"
                className="simple-editor-content"
              />

            </>
          )}
        </div>
      </EditorContext.Provider>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        noteTitle={fileName}
      />
    </div>
  )
}
