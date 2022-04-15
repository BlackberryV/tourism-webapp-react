import React, {FC, useContext, useEffect, useState} from 'react';
import {AuthContext} from "../firebase/AuthContext";
import {IUser} from "../types";
import {getUserById} from "../firebase/firebase";

const CommentForm: FC = () => {
    const user = useContext(AuthContext);
    const [dbUser, setDbUser] = useState<IUser | undefined>(undefined)
    useEffect(() => {
        getUserById(user?.uid).then((user) => {
            setDbUser(user)
        })
    }, [user?.uid])
    return (
        <form className="comment-form">
            <div className="avatar">{dbUser?.name.substr(0, 1)}</div>
            <input type="text" className="comment-input" placeholder='Add a comment...'/>
            <button className="comment-button">Submit</button>
        </form>
    );
};

export default CommentForm;