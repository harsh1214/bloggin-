import { useParams } from "react-router-dom"
import CreateBlog from "@/features/user/CreateBlog"

export default function EditBlogPage() {

    const { id } = useParams()

    return (
        <CreateBlog key={id} />
    )
}