import React, {FC} from 'react';
import {IComment} from "../types";
import Comment from "./Comment";
interface IComentListProps {
    commentsArr:IComment[];
}
const CommentsList:FC<IComentListProps> = ({commentsArr}) => {
    return (
        <div className='comment-list'>
            {commentsArr.map((comment)=>(
                <Comment key={comment.authorId+comment.date} commentData={comment}/>
            ))}
        </div>
    );
};

export default CommentsList;