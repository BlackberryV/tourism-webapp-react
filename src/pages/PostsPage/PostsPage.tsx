import { onSnapshot } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import PostItem from "../../components/PostItem"
import { getAllPosts } from "../../firebase/firebase"
import { ILocation } from "../../types"

const PostsPage: React.FC = () => {
    const postsQuery = getAllPosts()
    const [posts, setPosts] = useState<ILocation[]>([])

    useEffect(() => {
        onSnapshot(postsQuery, (snapshot) => {
            let allPosts: ILocation[] = []
            snapshot.docs.forEach((doc) => {
                let {name, coordinates, images, description, date, rating, cachedRating, comments} = doc.data()
                allPosts.push({name, coordinates, images, description, date, rating, cachedRating, id: doc.id, comments})
            })
            setPosts(allPosts)
        })
    }, [])

    const postsToRender = posts.map((post) => {
        return <PostItem key={post.id} post={post} />
    })

    return (
        <>
            <div className="page-container">
                <div className='sorting-panel'>
                    <div className="sort-item">Popular</div>
                    <div className="sort-item">Country</div>
                </div>
                <div className="content-container">
                    {postsToRender}
                </div>
            </div>
        </>
    )
}

export default PostsPage
