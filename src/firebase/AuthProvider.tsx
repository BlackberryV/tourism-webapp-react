import {FC, useEffect, useState} from "react";
import firebase from "firebase/auth";
import {auth} from "./firebase"
import {AuthContext} from "./AuthContext";

export const AuthProvider: FC = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null);

    useEffect(() => {
        return auth.onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser);
        });
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};