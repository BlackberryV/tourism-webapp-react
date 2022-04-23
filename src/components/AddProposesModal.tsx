import React, {FC, useContext, useEffect, useState} from 'react';
import Modal from "./Modal";
import {FormikProps, useFormik} from "formik";
import * as Yup from "yup";
import {addPropose, getUserById, uploadFile} from "../firebase/firebase";
import {AuthContext} from "../firebase/AuthContext";
import {useParams} from "react-router-dom";
import {ILocation, IUser} from "../types";

interface AddToFavoritesModalProps {
    active: boolean,
    setActive: (isActive: boolean) => void,
    post: ILocation,
}

interface ProposesFormValues {
    files: FileList | null
}

const AddProposesModal: FC<AddToFavoritesModalProps> = ({active, setActive, post}) => {

    const [urls, setUrls] = useState<string[]>([]);
    const [dbUser, setDbUser] = useState<IUser | undefined>(undefined);
    const user = useContext(AuthContext)
    const {id} = useParams();

    useEffect(() => {
        getUserById(user?.uid).then(setDbUser)
    }, [])

    const formik: FormikProps<ProposesFormValues> = useFormik<ProposesFormValues>({
        initialValues: {
            files: null
        },
        validationSchema: Yup.object({
            files: Yup.mixed().required("Files is required")
        }),
        onSubmit: async (values, {resetForm}) => {
            if (!dbUser || !id) return
            await addPropose(dbUser, urls, post)
            resetForm()
            setUrls([])
            setActive(false)
        },
    })

    const handleChangeFiles = async (files: FileList) => {
        await Promise.all(Array.from(files).map(uploadFile))
            .then(urls => setUrls(urls)).catch(err => console.log(err))

    }
    return (
        <Modal active={active} setActive={setActive}>
            <form onSubmit={formik.handleSubmit}>
                <input type={"file"}
                       onChange={(e) => {
                           formik.setFieldValue("files", e.currentTarget.files)
                           if (!e.currentTarget.files) return
                           handleChangeFiles(e.currentTarget.files).then()
                       }}
                       multiple
                       id={"files"}
                       name={"files"}
                />
                {formik.errors.files ? <div>{formik.errors.files}</div> : null}
                <button type={"submit"} disabled={urls.length === 0}>Propose your photos</button>
            </form>
        </Modal>
    );
};

export default AddProposesModal;