import firebase from "firebase/compat";
import FieldValue = firebase.firestore.FieldValue;
import {Timestamp} from "firebase/firestore";

export interface IUser {
    uid: string,
    name: string,
    email: string,
    selectedLocations: ILocation[],
    role: 'USER' | 'ADMIN',
}

export interface ILocation {
    id?: string,
    name: string,
    coordinates: ICoordinates,
    images: string[],
    description: string,
    date: FieldValue,
    comments: IComment[],
    rating: IRating[],
    cachedRating: number,
    type: string
}

export interface IComment {
    authorId: string,
    text: string,
    date: Timestamp,
}

export interface IPropose {
    id?: string,
    author: IUser,
    images: string[],
    location: ILocation,
    date: FieldValue,
}

export interface ICoordinates {
    lat: number,
    lng: number,
}

export interface IRating {
    userId: string,
    value: number,
}
