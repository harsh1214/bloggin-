import { uploadEditorImage } from "@/utils/uploadService"
import { useRef, useState } from "react"

export default function FloatingMenuBar({ editor }) {

    const [open, setOpen] = useState(false)
    const [showImageBox, setShowImageBox] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    if (!editor) return null

    const handleImageUrl = () => {
        if (!imageUrl.trim()) return
        editor.chain().focus().setImage({ src: imageUrl, }).run()
        setImageUrl("")
        setShowImageBox(false)
        setOpen(false)
    }

    const handleImageUpload = async (e) => {
        try {
            const file = e.target.files?.[0]

            if (!file) return

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ]

            if (!allowedTypes.includes(file.type)) {
                alert("Invalid image type")
                return
            }

            const maxSize = 5 * 1024 * 1024

            if (file.size > maxSize) {
                alert("Image too large")
                return
            }

            setUploading(true)

            const url = await uploadEditorImage(file)

            editor.chain().focus().setImage({ src: url, }).run()
            setShowImageBox(false)
            setOpen(false)
        } catch (error) {
            console.log(error)
        } finally {
            e.target.value = ""
            setUploading(false)
        }
    }

    return (
        <div className="relative flex items-center">

            <button type="button" onClick={() => setOpen(!open)} className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white pb-1 hover:bg-gray-100 hover:cursor-pointer text-2xl flex items-center justify-center shadow-sm transition">+</button>

            {open && (
                <div
                    className="
                        absolute left-14 top-0
                        bg-white
                        border border-gray-200
                        rounded-2xl
                        shadow-2xl
                        p-3
                        min-w-40 text-center
                        z-50
                    "
                >
                    <div className="sm:min-w-64">

                        {!showImageBox ? (
                            <button
                                type="button"
                                onClick={() => setShowImageBox(true)}
                                className="
                                    w-full text-left
                                    px-4 py-3
                                    rounded-xl
                                    hover:bg-gray-100
                                    transition
                                    text-sm font-medium
                                "
                            >
                                Add Image
                            </button>
                        ) : (
                            <div className="flex flex-col gap-4">

                                <div className="flex flex-col gap-2">

                                    <label className="text-sm font-medium text-gray-700">
                                        Image URL
                                    </label>

                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) =>
                                            setImageUrl(e.target.value)
                                        }
                                        placeholder="https://example.com/image.jpg"
                                        className="
                                            w-full px-4 py-2
                                            border border-gray-300
                                            rounded-xl
                                            outline-none
                                            focus:ring-2 focus:ring-black
                                        "
                                    />

                                    <button
                                        type="button"
                                        disabled={uploading}
                                        onClick={handleImageUrl}
                                        className="
                                            w-full py-2
                                            rounded-xl
                                            bg-black text-white
                                            hover:bg-gray-800
                                            transition
                                        "
                                    >
                                        Add via URL
                                    </button>

                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-px bg-gray-200 flex-1" />
                                    <span className="text-xs text-gray-400">
                                        OR
                                    </span>
                                    <div className="h-px bg-gray-200 flex-1" />
                                </div>

                                <div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />

                                    <button
                                        type="button"
                                        disabled={uploading}
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                        className={`w-full py-2 rounded-xl border border-gray-300 transition ${uploading
                                            ? "bg-gray-200 cursor-not-allowed opacity-60"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {uploading ? "Uploading..." : "Upload Image"}
                                    </button>

                                </div>

                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}