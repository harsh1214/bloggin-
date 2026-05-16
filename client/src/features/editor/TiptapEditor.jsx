import { useEditor, EditorContent } from "@tiptap/react"

import { BubbleMenu } from "@tiptap/react/menus"
import { FloatingMenu } from "@tiptap/react/menus"
import { extensions } from "./extensions"

import BubbleMenuBar from "./BubbleMenuBar"
import FloatingMenuBar from "./FloatingMenuBar"

import "../../styles/editor.css"
import { useEffect } from "react"

export default function TiptapEditor({ content, onChange }) {

    const editor = useEditor({
        extensions,
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    useEffect(() => {
        if (editor && content && content !== editor.getHTML()) {
            editor.commands.setContent(
                content
            )
        }
    }, [content, editor]);

    if (!editor) return null

    return (
        <div className="w-full">

            <BubbleMenu
                editor={editor}
                options={{
                    placement: "top",
                }}
            >
                <BubbleMenuBar editor={editor} />
            </BubbleMenu>

            <FloatingMenu
                editor={editor}
                options={{
                    placement: "left",
                }}
            >
                <FloatingMenuBar editor={editor} />
            </FloatingMenu>

            <EditorContent
                editor={editor}
                className="min-h-72 p-4"
            />

        </div>
    )
}

