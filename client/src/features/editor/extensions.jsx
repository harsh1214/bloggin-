import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"

export const extensions = [
    StarterKit.configure({
        link: false,
    }),

    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
    }),

    Image.configure({
        inline: false,
        allowBase64: true,
    }),

    Placeholder.configure({
        placeholder: `Tell your story...`,
    }),
]