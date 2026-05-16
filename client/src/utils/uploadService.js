import api from "@/api/axios"

export const uploadEditorImage = async (file) => {

    const formData = new FormData()

    formData.append("image", file)

    const { data } = await api.post("/blog/uploadEditorImage", formData, { 
        headers: {
            "Content-Type":
            "multipart/form-data",
        },
    });

    return data.url;
}