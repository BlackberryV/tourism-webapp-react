import { onSnapshot } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import PostItem from "../../components/PostItem"
import {ascendingSort, dateSort, descendingSort, getAllPosts} from "../../firebase/firebase"
import { ILocation } from "../../types"

const PostsPage: React.FC = () => {
    const postsQuery = getAllPosts()
    const [posts, setPosts] = useState<ILocation[]>([])
    const [popSortState, setPopSortState] = useState<string>('default');
    const popularSort = () => {
        switch (popSortState){
            case 'default' :
                setPosts([...ascendingSort(posts)]);
                setPopSortState('ascending')
                break;
            case 'ascending' :
                setPosts([...descendingSort(posts)]);
                setPopSortState('descending')
                break;
            case 'descending' :
                setPosts([...dateSort(posts)])
                setPopSortState('default')
                break;
        }
    }

    useEffect(() => {
        onSnapshot(postsQuery, (snapshot) => {
            let allPosts: ILocation[] = []
            snapshot.docs.forEach((doc) => {
                let {name, coordinates, type, images, description, date, rating, cachedRating, comments} = doc.data()
                allPosts.push({name, type, coordinates, images, description, date, rating, cachedRating, id: doc.id, comments})
            })
            setPosts(allPosts);
        })
    }, []);

    const postsToRender = posts.map((post) => {
        return <PostItem key={post.id} post={post} />
    })

    return (
        <>
            <div className="page-container">
                <div className='sorting-panel'>
                    <div onClick={popularSort} className="sort-item">
                        Popular
                        {popSortState==='default' ? <span className='double-arrow'>↔</span> : popSortState==='ascending' ? <span>↓</span> : <span>↑</span>}
                    </div>
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
