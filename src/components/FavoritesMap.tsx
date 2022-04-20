import React, {FC} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {ILocation} from "../types";

interface IFavoritesMapProps {
    locations:ILocation[],
}

const FavoritesMap: FC<IFavoritesMapProps> = ({locations}) => {
    return (
            <MapContainer center={{lat:0, lng:0}} zoom={1.5}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map(e=><Marker position={e.coordinates}>
                    <Popup>{e.name}</Popup>
                </Marker>)}
            </MapContainer>
    );
};

export default FavoritesMap;