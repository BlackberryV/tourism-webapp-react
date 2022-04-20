import React, {FC} from 'react';
import {ILocation} from "../types";
import FavoritesItem from "./FavoritesItem";
interface IFavoritesListProps {
    favArr:ILocation[];
}
const FavoritesList:FC<IFavoritesListProps> = ({favArr}) => {
    return (
        <div className='favorites-list'>
            {favArr.map((favLoc)=>(
                <FavoritesItem key={favLoc.id} locData={favLoc}/>
            ))}
        </div>
    );
};

export default FavoritesList;