import React, {FC, useEffect, useState} from 'react';
import {IComment, IUser} from "../types";
import {getUserById} from "../firebase/firebase";
import {useNavigate} from "react-router-dom";

interface ICommentProps{
    commentData:IComment,
}

const Comment:FC<ICommentProps> = ({commentData}) => {
    const [dbUser, setDbUser] = useState<IUser | undefined>(undefined)
    const navigate = useNavigate();
    useEffect(() => {
        getUserById(commentData.authorId).then((user) => {
            setDbUser(user)
        })
    },[])
    const handleProfileNavigate = () => {
        navigate(`/profile/${dbUser?.uid}`)
    }
    return (
        <div className='comment-item'>
            <div onClick={handleProfileNavigate} style={{background:'#'+Math.floor(Math.random()*16777215).toString(16)}} className="avatar">{dbUser?.name.substr(0, 1)}</div>
            <div className="comment-content">
                <div className="user-title">{dbUser?.name}</div>
                <div className="comment-text">{commentData.text}</div>
            </div>
            <div className="comment-date">{commentData.date.toDate().toDateString()}</div>
        </div>
    );
};

export default Comment;