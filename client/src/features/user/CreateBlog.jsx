import React, { useEffect, useMemo, useState } from 'react'
import TiptapEditor from '../editor/TiptapEditor'
import CategoriesColor from '@/utils/CategoriesColor'
import api from '@/api/axios'
import { useNavigate, useParams } from 'react-router-dom'

export default function CreateBlog() {

    const { id } = useParams();
    const isEditMode = !!id;
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [banner, setBanner] = useState(null);
    const [content, setContent] = useState("");
    const [loader, setLoader] = useState(false);
    const [existingBanner, setExistingBanner] = useState("");
    const [removeBanner, setRemoveBanner] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const TITLE_LIMIT = 80;
    const primaryButtonText = isEditMode ? (isHidden ? "Publish" : "Update") : "Publish";
    const secondaryButtonText = isEditMode ? (isHidden ? "Save Draft" : null) : "Save as Draft";

    const handleCategory = (category) => {
        const alreadySelected = selectedCategories.includes(category);

        if (alreadySelected) {
            setSelectedCategories(
                selectedCategories.filter(
                    (item) => item !== category
                )
            )
            return
        }

        if (selectedCategories.length >= 2) {
            return
        }

        setSelectedCategories((prev) => [
            ...prev,
            category,
        ])
    }

    const validateForm = () => {
        const newErrors = {}

        if (!title.trim()) {
            newErrors.title = "Title is required"
        }

        else if (title.trim().length < 10) {
            newErrors.title = "Title too short"
        }

        const plainContent = content.replace(/<[^>]*>/g, "").trim()

        if (!plainContent) {
            newErrors.content = "Content is required"
        }
        else if (plainContent.length < 100) {
            newErrors.content = "Content too short"
        }

        if (selectedCategories.length === 0) {
            newErrors.categories = "Select at least 1 category"
        }
        setErrors(newErrors)
        return (Object.keys(newErrors).length === 0)
    }


    const handleSubmit = async (status) => {
        try {
            if (!validateForm()) {
                return
            }
            setLoader(true)
            const data = new FormData();
            data.append("title", title);
            data.append("content", content);
            data.append("categories", JSON.stringify(selectedCategories));
            data.append("isHidden", status === "draft");
            data.append("removeBanner", removeBanner);
            if (banner) {
                data.append("banner", banner);
            }
            const endpoint = isEditMode ? `/blog/update/${id}` : "/blog/createBlog";
            const method = isEditMode ? api.put : api.post;
            const res = await method(endpoint, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate(`/blog/${res.data.data.id}`);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoader(false)
        }
    }

    useEffect(() => {

        if (!isEditMode) { return }

        const getBlog = async () => {
            try {
                const { data } = await api.get("/blog/getBlog", { params: { id } });
                const blog = data.data;
                setTitle(blog.title);
                setContent(blog.content);
                setIsHidden(blog.isHidden);
                setExistingBanner(blog.image);
                setSelectedCategories(blog.categories.map((item) => item.category.name));
            }
            catch (err) {
                console.log(err);
            }
        }

        getBlog();
    }, [id, isEditMode]);

    const previewUrl = useMemo(() => {
        if (!banner) {
            return (existingBanner || "")
        }
        return URL.createObjectURL(banner)

    }, [banner, existingBanner])

    useEffect(() => {

        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl)
            }
        }

    }, [previewUrl])

    return (
        <div className="w-full h-full relative z-0">
            {
                loader && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )
            }
            <div className="container mx-auto px-4 pt-12 pb-12 relative z-20">
                <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col items-center justify-center max-w-248 mx-auto">
                    <div className="w-full">
                        <input value={title} onChange={(e) => { const value = e.target.value; if (value.length <= TITLE_LIMIT) { setTitle(value); } setErrors((prev) => ({ ...prev, title: "" })); }} className="w-full px-4 pt-2 text-2xl font-bold outline-0 mb-4" placeholder="Title" type="text" name="title" id="title" />
                        <p className={`px-4 pb-1 text-sm ${title.length > TITLE_LIMIT - 10 ? "text-red-500" : "text-gray-400"}`}>{title.length}/{TITLE_LIMIT}</p>
                        {
                            errors.title && (
                                <p className="text-red-500 text-sm mt-2 px-4 font-medium">{errors.title}</p>
                            )
                        }
                    </div>
                    <div className="w-full mb-6 px-4 py-2">
                        {
                            !existingBanner && !banner &&
                            <>
                                <label className="block text-sm font-semibold mb-3">Banner Image</label>
                                <div className="w-full border-2 border-dashed border-zinc-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-zinc-50 transition hover:border-blue-400 hover:bg-blue-50">
                                    <input id="banner" type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (!file) return; setBanner(file); setRemoveBanner(false); }} />
                                    <label htmlFor="banner" className="cursor-pointer flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">📷</div>
                                        <p className="mt-4 font-medium">Click to upload banner</p>
                                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP</p>
                                    </label>
                                </div>
                            </>
                        }
                        {
                            (existingBanner || banner) && !removeBanner && (
                                <div className="mt-5 relative w-full max-w-xl">
                                    <img src={previewUrl} alt="Banner" className="w-full aspect-video object-cover rounded-lg border" />
                                    <button type="button" onClick={() => { setBanner(null); setExistingBanner(""); setRemoveBanner(true); }} className="absolute cursor-pointer top-3 right-3 bg-red-500 hover:bg-red-600 text-white sm:text-sm text-xs px-4 py-2 rounded-full shadow-lg">
                                        Remove Banner
                                    </button>
                                </div>
                            )
                        }
                    </div>
                    <div className="w-full">
                        <TiptapEditor content={content} onChange={(value) => { setContent(value); setErrors((prev) => ({ ...prev, content: "" })); }} />
                        {
                            errors.content && (
                                <p className="text-red-500 text-sm mt-2 font-medium px-4 mb-4">{errors.content}</p>
                            )
                        }
                    </div>
                    <div className="w-full px-4 py-2 flex sm:flex-row flex-col items-start justify-start gap-4">
                        <label htmlFor="categories">Categories: (maximum 2)
                            {
                                errors.categories && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{errors.categories}</p>
                                )
                            }
                        </label>
                        <div className="w-full flex flex-row items-center justify-start flex-wrap gap-2 max-lg:max-h-40 max-lg:overflow-scroll">
                            {
                                Object.entries(CategoriesColor).map(([category, styles]) => {
                                    const active = selectedCategories.includes(category)
                                    const disabled = !active && selectedCategories.length >= 2

                                    return (
                                        <div key={category} className={`px-4 py-2 rounded-full flex flex-row items-center justify-start gap-2 text-sm font-medium cursor-pointer select-none ${active ? styles.active : styles.inactive} ${disabled ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}`}>
                                            <input checked={active} disabled={disabled} onChange={() => { handleCategory(category); setErrors((prev) => ({ ...prev, categories: "" })); }} placeholder={category} type="checkbox" name={category} id={category} />
                                            <label className={`cursor-pointer`} htmlFor={category}>{category}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="w-full mt-4 flex sm:flex-row flex-col items-center justify-center sm:gap-4 gap-2 max-sm:pt-4">
                        {
                            secondaryButtonText && (
                                <button onClick={() => handleSubmit("draft")} className="btn max-sm:w-full flex items-center justify-center border border-transparent text-base font-semibold rounded-3xl text-white bg-blue-500 hover:bg-blue-700 hover:cursor-pointer py-2 px-8" type="button">{secondaryButtonText}</button>
                            )
                        }
                        <button onClick={() => handleSubmit("publish")} className="btn max-sm:w-full flex items-center justify-center border border-transparent text-base font-semibold rounded-3xl text-white bg-blue-500 hover:bg-blue-700 hover:cursor-pointer py-2 px-8" type="button">{primaryButtonText}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}