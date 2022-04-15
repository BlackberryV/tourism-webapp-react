import firebase from "firebase/compat";
import FieldValue = firebase.firestore.FieldValue;

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
    comments: IComment[]
    rating: IRating[],
    cachedRating: number
}

export interface IComment {
    author: IUser,
    text: string,
    date: Date,
}

export interface ISuggestion {
    author: IUser,
    image: File,
    location: ILocation,
}

export interface ICoordinates {
    lat: number,
    lng: number
}

export interface IRating {
    userId: string,
    value: number
}
