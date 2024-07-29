
export const loadScheduledPosts = async (setPosts) => {
    fetch('/api/get-posts')
        .then(res => res.json())
        .then(data => {
            setPosts(data.posts);
        })
}