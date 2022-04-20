import React, {useEffect, useState} from "react"
import {NavLink, useParams} from "react-router-dom";
import {ILocation, IUser} from "../../types";
import {getFavorites, getUserById} from "../../firebase/firebase";
import FavoritesList from "../../components/FavoritesList";
import FavoritesMap from "../../components/FavoritesMap";

const ProfilePage: React.FC = () => {
    const {profileId} = useParams();
    const [dbUser, setDbUser] = useState<IUser | undefined>(undefined);
    const [favArr, setFavArr] = useState<ILocation[]>([]);
    useEffect(() => {
        getUserById(profileId).then((user) => {
            setDbUser(user)
        })
        if (dbUser?.uid) {
            getFavorites(dbUser?.uid).then((locations) => {
                setFavArr(locations);
            })
        }
    }, [dbUser?.uid, profileId, favArr.length])
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
                    <div className="white-container profile-info first">
                        <div className="profile-avatar">{dbUser?.name.substr(0, 1)}</div>
                        <div className="profile-info-text">
                            <div className="profile-info-title">{dbUser?.name}</div>
                            <div className="profile-info-mail">{dbUser?.email}</div>
                        </div>
                    </div>
                    <div className="white-container favorite-title">Favorites locations</div>
                    {favArr?.length !== 0 ?
                        <>
                            <div className='white-container'>
                                <FavoritesList favArr={favArr}/>
                            </div>
                            <div className='white-container profile-map-container'>
                                <FavoritesMap locations={favArr}/>
                            </div>
                        </>
                        :
                        <div className='white-container empty-list'>Favorites list is empty...</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
