import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import Map from "../../components/Map";
import CommentForm from "../../components/CommentForm";
import {useParams} from "react-router-dom";
import {getPostById} from "../../firebase/firebase";
import {ILocation} from "../../types";
import Slider from "../../components/Slider";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const PostDetailPage: React.FC = () => {
    const {id} = useParams()
    const [post, setPost] = useState<ILocation>()

    useEffect(() => {
        if (!id) {
            return
        }

        const getPost = async (id: string) => {
            const doc = await getPostById(id)
            if (!doc.exists()) {
                return
            }
            const {name, coordinates, images, description, date, rating, cachedRating, comments} = doc.data()
            const loc = {name, coordinates, images, description, date, rating, cachedRating, id: doc.id, comments}
            setPost(loc)
        }

        getPost(id)

    }, [])

    if (!post) {
        return <></>
    }

    return (
        <div className='page-container'>
            <div className='back'>
                <NavLink className='back-link' to='/'>
                    <svg className='arrow' xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 30 24"
                         fill="none">
                        <path
                            d="M0.93934 10.9393C0.353553 11.5251 0.353553 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97918 12.6066 1.3934C12.0208 0.807612 11.0711 0.807612 10.4853 1.3934L0.93934 10.9393ZM30 10.5L2 10.5L2 13.5L30 13.5L30 10.5Z"
                            fill="black"/>
                    </svg>
                    Back
                </NavLink>
            </div>
            <div className="content-container">
                <div className="gray-container">
                    <div className="white-container first">
                        <div className="location-image-container">
                            <img
                                src={post.images[0]}
                                alt="" className="location-image"/>
                        </div>
                        <div className="location-text">
                            <div className="text-top">
                                <div className="location-title">{post.name}
                                </div>
                                <div className="rating">Rating</div>
                            </div>
                            <div className="text-description">{post.description}
                            </div>
                        </div>
                    </div>
                    {post.images.length > 1 ?
                        <div className="white-container slider-container"><Slider images={post.images}/></div> :
                        <></>
                    }
                    <div className="white-container add">
                        <div className="add-text">Add this place to favourites</div>
                        <button className="add-button">+</button>
                    </div>
                    <div className="white-container map-container">
                        <Map position={{
                            lat: post.coordinates.lat,
                            lng: post.coordinates.lng
                        }}/>
                    </div>
                    <div className="white-container add">
                        <div className="add-text">If you have any pictures from this place you can propose them</div>
                        <button className="add-button">+</button>
                    </div>
                    <div className="white-container comments">
                        <CommentForm/>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PostDetailPage
