import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Map from "../../components/Map";
import CommentForm from "../../components/CommentForm";
import {useParams} from "react-router-dom";
import {addToFavorites, deleteFromFavorites, getFavorites, getPostById, getUserById} from "../../firebase/firebase";
import {ILocation, IUser} from "../../types";
import Slider from "../../components/Slider";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CommentsList from "../../components/CommentsList";
import AddProposesModal from "../../components/AddProposesModal";
import {AuthContext} from "../../firebase/AuthContext";

const PostDetailPage: React.FC = () => {
    const navigation = useNavigate();
    const {id} = useParams();
    const [post, setPost] = useState<ILocation>()
    const [modalActive, setModalActive] = useState(false);
    const user = useContext(AuthContext);
    const [dbUser, setDbUser] = useState<IUser | undefined>(undefined);
    const [favLocs, setFavLocs] = useState<ILocation[] | undefined>(undefined);
    const [isFav, setIsFav] = useState<ILocation | undefined>(undefined);
    const favoritesHandler = () => {
        if (post === undefined || dbUser === undefined) return
        addToFavorites(dbUser?.uid, post).then();
        setIsFav(post);
    }
    const deleteHandler = () => {
        if (post === undefined || dbUser === undefined) return
        deleteFromFavorites(dbUser?.uid, post).then();
        setIsFav(undefined)
    }
    useEffect(() => {
        if (!id) {
            return
        }
        const getPost = async (id: string) => {
            const doc = await getPostById(id)
            if (!doc.exists()) {
                return
            }
            const {name, coordinates, images, description, date, rating, cachedRating, comments, type} = doc.data()
            const loc = {
                name, type, coordinates, images, description, date, rating, cachedRating, id: doc.id, comments
            }
            setPost(loc)
        }
        getPost(id).then();
        getUserById(user?.uid).then((user) => {
            setDbUser(user)
        })
        getFavorites(user?.uid).then((locations) => {
            setFavLocs(locations);
        })
        setIsFav(favLocs?.find(loc => loc.id === post?.id))
    }, [user?.uid, favLocs?.length])


    if (!post) {
        return <></>
    }
    return (
        <div className='page-container'>
            <div className='back'>
                <div className='back-link' onClick={() => navigation(-1)}>
                    <svg className='arrow' xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 30 24"
                         fill="none">
                        <path
                            d="M0.93934 10.9393C0.353553 11.5251 0.353553 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97918 12.6066 1.3934C12.0208 0.807612 11.0711 0.807612 10.4853 1.3934L0.93934 10.9393ZM30 10.5L2 10.5L2 13.5L30 13.5L30 10.5Z"
                            fill="black"/>
                    </svg>
                    Back
                </div>
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
                            <div className="text-description">{post.description}</div>
                            <div>{post.type}</div>
                        </div>
                    </div>
                    {post.images.length > 1 ?
                        <div className="white-container slider-container"><Slider images={post.images}/></div> : null
                    }
                    {isFav ?
                        <div className="white-container add">
                            <div className="add-text">This place is already on the favorites list</div>
                            <button className="add-button delete-button" onClick={deleteHandler}>+</button>
                        </div>
                        :
                        <div className="white-container add">
                            <div className="add-text">Add this place to favourites</div>
                            <button className="add-button" onClick={favoritesHandler}>+</button>
                        </div>
                    }
                    <div className="white-container map-container">
                        <Map position={{
                            lat: post.coordinates.lat,
                            lng: post.coordinates.lng
                        }}/>
                    </div>
                    <div className="white-container add">
                        <div className="add-text">If you have any pictures from this place you can propose them</div>
                        <button
                            className="add-button"
                            onClick={() => setModalActive(!modalActive)}
                        >+
                        </button>
                    </div>
                    <div className="white-container comments">
                        <CommentForm locationId={id}/>
                        <CommentsList commentsArr={post.comments}/>
                    </div>
                </div>
            </div>
            <AddProposesModal active={modalActive} setActive={setModalActive} post={post}/>
        </div>

    )
}

export default PostDetailPage
