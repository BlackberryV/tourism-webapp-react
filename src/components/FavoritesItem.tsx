import React, {FC} from 'react';
import {ILocation} from "../types";
import Map from "./Map";
import {useNavigate} from "react-router-dom";
interface IFavoritesItemProps {
    locData:ILocation;
}
const FavoritesItem:FC<IFavoritesItemProps> = ({locData}) => {
    const nav = useNavigate();
    const handlePostDetailNavigate = () => {
        nav(`/posts/${locData.id}`)
    }
    return (
        <div className='favorite-item'>
            <div className="favorite-item-img-container" onClick={handlePostDetailNavigate}>
                <img src={locData.images[0]} alt="" className='favorite-item-img'/>
            </div>
            <div className='favorite-item-text'>
                <div className="favorite-item-title" onClick={handlePostDetailNavigate}>{locData.name}</div>
                <div>Rating</div>
            </div>
            <div className="favorite-item-map-container">
                <Map position={locData.coordinates}/>
            </div>
        </div>
    );
};

export default FavoritesItem;