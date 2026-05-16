import CategoryFallbackImages from "./CategoryFallbackImages"

const getBlogImage = (blog) => {

    const categoryName = blog.categories?.[0] ?.category?.name
    const fallbackImage = CategoryFallbackImages[categoryName] || CategoryFallbackImages.Default

    return (blog.image || fallbackImage)
}

export default getBlogImage