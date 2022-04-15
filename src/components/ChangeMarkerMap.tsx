import React, {FC, useEffect, useState} from 'react';
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import {LeafletMouseEvent} from "leaflet";
import {ICoordinates} from "../types";

interface ChangeMarkerMapProps {
    onMapClick: (coordinates: ICoordinates) => void
}

const ChangeMarkerMap: FC<ChangeMarkerMapProps> = ({onMapClick}) => {
    const center: ICoordinates = {
        lat: 50.44827739983516,
        lng: 30.524597066687424
    }

    const [position, setPosition] = useState<ICoordinates>(center)

    useEffect(() => {
        onMapClick(position)
    }, [position])

    function LocationMarker() {
        useMapEvents({
            click(e: LeafletMouseEvent) {
                setPosition({lat: e.latlng.lat, lng: e.latlng.lng})
            },
        })

        return position === null ? null : (
            <Marker position={position}/>
        )
    }

    return (
        <MapContainer className='add-map' center={position} zoom={10}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker/>
        </MapContainer>
    );
};

export default ChangeMarkerMap;