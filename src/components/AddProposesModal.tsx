import React, {FC, useContext, useState} from 'react';
import Modal from "./Modal";
import {FormikProps, useFormik} from "formik";
import * as Yup from "yup";
import {addPropose, uploadFile} from "../firebase/firebase";
import {AuthContext} from "../firebase/AuthContext";
import {useParams} from "react-router-dom";

interface AddToFavoritesModalProps {
    active: boolean,
    setActive: (isActive: boolean) => void
}

interface ProposesFormValues {
    files: FileList | null
}

const AddProposesModal: FC<AddToFavoritesModalProps> = ({active, setActive}) => {

    const [urls, setUrls] = useState<string[]>([]);
    const user = useContext(AuthContext)
    const {id} = useParams();

    const formik: FormikProps<ProposesFormValues> = useFormik<ProposesFormValues>({
        initialValues: {
            files: null
        },
        validationSchema: Yup.object({
            files: Yup.mixed().required("Files is required")
        }),
        onSubmit: async () => {
            if (!user || !id) return
            await addPropose(user.uid, urls, id)
            console.log("add propose")
        },
    })

    const handleChangeFiles = async (files: FileList) => {
        await Promise.all(Array.from(files).map(uploadFile))
            .then(urls => setUrls(urls))
        console.log(`create urls ${urls}`)
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
                <button type={"submit"}>Propose your photos</button>
            </form>
        </Modal>
    );
};

export default AddProposesModal;