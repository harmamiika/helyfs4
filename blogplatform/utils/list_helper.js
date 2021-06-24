const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    return blogs.reduce((mostLikesBlog, blog) => {
        if (blog.likes > mostLikesBlog.likes) {
            return blog
        } else {
            return mostLikesBlog
        }
    }, {likes: 0})
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}