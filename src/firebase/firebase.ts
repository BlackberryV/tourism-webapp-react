import {initializeApp} from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth"
import {
    addDoc,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore"
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
    deleteObject,
} from "firebase/storage";
import {IComment, ICoordinates, ILocation, IPropose, IRating, IUser} from "../types";

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
export const storage = getStorage(app);

//DB functions
const usersCollection = collection(db, 'users');
const locationCollection = collection(db, 'locations');
export const proposesCollection = collection(db, 'proposes');

export const getProposes = async () => {
    return await getDocs(proposesCollection)
}

export const deleteFileFromStorage = async (url: string) => {
    const fileRef = await ref(storage, url)
    await deleteObject(fileRef)
}

export const addImageToLocation = async (locationId: string, imageUrls: string[], proposeId: string) => {
    const locationRef = doc(db, "locations", locationId)
    await updateDoc(locationRef, {images: arrayUnion(...imageUrls)}).then(() => console.log("Add image to location"))
    const proposeRef = doc(db, "proposes", proposeId)
    await deleteDoc(proposeRef).then(() => console.log("Delete propose"))
}

export const deletePropose = async (proposeId: string, urls: string[]) => {
    const proposeRef = doc(db, "proposes", proposeId)
    await deleteDoc(proposeRef).then(() => console.log("Decline propose"))
    urls.forEach(url => deleteFileFromStorage(url))
}

export const addComment = async (postId: string, authorId: string, commentContent: string) => {
    const comment: IComment = {
        authorId: authorId,
        text: commentContent,
        date: Timestamp.now(),
    }
    const docRef = doc(db, "locations", postId)
    updateDoc(docRef, {comments: arrayUnion(comment)}).then(() => console.log("Add comment"))
}

export const uploadFile = async (file: File): Promise<string> => {
    const imageStorageRef = await ref(storage, `/images/${file.name}`)
    const upload = uploadBytesResumable(imageStorageRef, file)
    return new Promise<string>((resolve, reject) => {
        upload.then(
            () => {
                const url = getDownloadURL(imageStorageRef);
                resolve(url)
            },
            reject
        )
    })
}

export const addPropose = async (user: IUser, urls: string[], location: ILocation) => {
    const newPropose: IPropose = {
        author: user,
        images: urls,
        location: location,
        date: serverTimestamp(),
    }
    await addDoc(proposesCollection, newPropose);
}

export const addLocation = async (name: string, description: string, urls: string[], coordinates: ICoordinates, type: string) => {
    const newLocation: ILocation = {
        type: type,
        name: name,
        images: urls,
        coordinates: coordinates,
        description: description,
        date: serverTimestamp(),
        rating: new Array<IRating>(),
        cachedRating: 0,
        comments: new Array<IComment>()
    }
    await addDoc(locationCollection, newLocation)
}

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

//queries

export const getAllPosts = () => {
    return query(locationCollection)
}

export const getPostById = async (id: string) => {
    const docRef = doc(db, "locations", id);
    return await getDoc(docRef)
}

export const updatePostRating = async (post: ILocation, rating: IRating) => {
    const postRef = doc(db, "locations", post.id || "")

    const ratingSum = post.rating.reduce((acc, currPost) => {
        return acc + currPost.value
    }, 0)

    console.log(ratingSum)

    try {
        await updateDoc(postRef, {
            rating: post.rating.concat(rating),
            cachedRating: (ratingSum + rating.value) / (post.rating.length + 1)
        })
    } catch (e) {
        console.log((e as Error).message)
    }
}

export const changePostRating = async (post: ILocation, rating: IRating) => {
    const postRef = doc(db, "locations", post.id || "")
    let prevUserRating = post.rating.find(rate => rate.userId === rating.userId)?.value || 0
    let newRating = post.rating.filter(rate => rate.userId !== rating.userId).concat(rating)
    let newCachedValue = (post.cachedRating * post.rating.length - prevUserRating + rating.value) / post.rating.length

    console.log(prevUserRating, newRating, newCachedValue)
    try {
        await updateDoc(postRef, {
            rating: newRating,
            cachedRating: newCachedValue
        })
    } catch (e) {
        console.log((e as Error).message)
    }
}

export const addToFavorites = async (uid: string, location: ILocation) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const docs = await getDocs(q);
    const userRef = doc(usersCollection, docs.docs[0].id);
    try {
        await updateDoc(userRef, {
            selectedLocations: arrayUnion(location)
        })
    } catch (e) {
        console.log((e as Error).message)
    }
}

export const getFavorites = async (uid: string | undefined) => {
    let favLocs: ILocation[] | undefined = [];
    await getUserById(uid).then(r => favLocs = r?.selectedLocations)
    return favLocs;
}

export const deleteFromFavorites = async (uid: string | undefined, location: ILocation) => {
    let favoritesArr: ILocation[] = [];
    await getFavorites(uid).then(r => favoritesArr = r);
    let filteredArr: ILocation[] = favoritesArr.filter(item => item.id !== location.id);
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const docs = await getDocs(q);
    const userRef = doc(usersCollection, docs.docs[0].id);
    try {
        await updateDoc(userRef, {
            selectedLocations: filteredArr
        })
    } catch (e) {
        console.log((e as Error).message)
    }
}


export const ascendingSort = (allLocs:ILocation[]) => {
    return allLocs.sort((a, b) => a.rating.length < b.rating.length ? 1 : -1);
}

export const descendingSort = (allLocs:ILocation[]) => {
    return allLocs.sort((a, b) => a.rating.length > b.rating.length ? 1 : -1);
}

export const dateSort = (allLocs:ILocation[]) => {
    return allLocs.sort((a, b) => a.date < b.date ? 1 : -1);
}


