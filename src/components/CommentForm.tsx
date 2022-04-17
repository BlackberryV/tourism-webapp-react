import React, {FC, useContext, useEffect, useState} from 'react';
import {AuthContext} from "../firebase/AuthContext";
import {IUser} from "../types";
import {addComment, getUserById} from "../firebase/firebase";
import {FormikProps, useFormik} from "formik";
import * as Yup from "yup"

interface CommentValues {
    comment: string,
}

interface CommentFormProps {
    locationId?: string
}

const CommentForm: FC<CommentFormProps> = ({locationId}) => {
    const user = useContext(AuthContext);
    const [dbUser, setDbUser] = useState<IUser | undefined>(undefined)
    useEffect(() => {
        getUserById(user?.uid).then((user) => {
            setDbUser(user)
        })
    }, [user?.uid])

    const formik: FormikProps<CommentValues> = useFormik<CommentValues>({
        initialValues: {
            comment: '',
        },
        validationSchema: Yup.object({
                comment: Yup.string().required("Comment content is required")
            }
        ),
        onSubmit: (values, {resetForm}) => {
            if (!user || !locationId) return
            addComment(locationId, user.uid, values.comment).then(() => console.log("Add comment"))
            resetForm();
        }
    })

    return (
        <div>
            <form
                onSubmit={formik.handleSubmit}
                className="comment-form">
                <div className="avatar">{dbUser?.name.slice(0, 1)}</div>
                <input
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    id={"comment"} name={"comment"}
                    type="text" className="comment-input" placeholder='Add a comment...'/>
                <button
                    type={"submit"}
                    className="comment-button">Submit
                </button>
            </form>
            {formik.errors.comment ? <div className='error-message comment-error'>{formik.errors.comment}</div> : null}
        </div>
    );
};

export default CommentForm;