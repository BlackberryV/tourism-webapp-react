import {initializeApp} from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth"
import {
    getFirestore,
    collection,
    addDoc,
    query, where, getDocs,
    serverTimestamp
} from "firebase/firestore"
import {ILocation, IUser} from "../types";

const firebaseConfig = {
    apiKey: "AIzaSyAkBRxravwg9cWcehtZd37Rs7K80kALxFA",
    authDomain: "tourism-webapp-react.firebaseapp.com",
    projectId: "tourism-webapp-react",
    storageBucket: "tourism-webapp-react.appspot.com",
    messagingSenderId: "405161810835",
    appId: "1:405161810835:web:8da45ffc38ba0be2a6a666"
};

const app = initializeApp(firebaseConfig);

//Init services
export const auth = getAuth(app);
export const db = getFirestore(app);

//DB functions
const usersCollection = collection(db, 'users');
const locationCollection = collection(db, 'locations');

//todo add location
// export const addLocation = async ({title, description, images, coordinates}: ILocation) => {
//     const newLocation: ILocation = {
//         id: Date.now(),
//         title: title,
//         images: images,
//         coordinates: coordinates,
//         description: description,
//         date: serverTimestamp(),
//         rate: 0
//     }
//     await addDoc(locationCollection, newLocation)
// }

export const getUserById = async (uid: string | undefined) => {
    if (uid === undefined) return
    const q = query(usersCollection, where('uid', '==', uid))
    let user: IUser = {
        uid: "",
        name: "",
        email: "",
        selectedLocations: [],
        role: "USER"
    };
    await getDocs(q).then(res => res.forEach((doc) => {
        user = {
            uid: doc.data().uid,
            name: doc.data().name,
            email: doc.data().email,
            selectedLocations: doc.data().selectedLocations,
            role: doc.data().role
        };
    }));
    return user;
}

//Auth functions
const googleProvider = new GoogleAuthProvider();

export const loginAccountWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            const newUser: IUser = {
                uid: user.uid,
                name: user.displayName as string,
                email: user.email as string,
                role: 'USER',
                selectedLocations: [],
            }
            await addDoc(collection(db, "users"), newUser);
        }
    } catch (error) {
        console.error(error);
    }
}

export const createAccountWithEmailAndPassword = async (email: string, password: string, name: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const newUser: IUser = {
            uid: user.uid,
            name: name,
            email: user.email as string,
            role: 'USER',
            selectedLocations: [],
        }
        await addDoc(usersCollection, newUser)
    } catch (error) {
        console.error(error)
    }
}

export const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.error(error)
    }
}

export const logOut = async () => {
    await signOut(auth);
};
