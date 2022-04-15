import React, {FC, useRef, useState} from 'react';
import ChangeMarkerMap from "./ChangeMarkerMap";
import {ICoordinates} from "../types";
import {addLocation, uploadFile} from "../firebase/firebase";
import {FormikProps, useFormik} from "formik";
import * as Yup from "yup"

interface CreatePostValues {
    name: string,
    description: string,
    coordinates: ICoordinates,
    urls: string[],
}

const CreatePostForm: FC = () => {
    const [coordinates, setCoordinates] = useState<ICoordinates>({
        lat: 50.44827739983516,
        lng: 30.524597066687424
    })
    const filesRef = useRef<HTMLInputElement>(null);
    const formik: FormikProps<CreatePostValues> = useFormik<CreatePostValues>({
        initialValues: {
            name: '',
            description: '',
            coordinates: coordinates,
            urls: [],
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            description: Yup.string().required("Required"),
            urls: Yup.array().required().min(1, "You need to add at least one image"),
        }),
        onSubmit: (values, {resetForm}) => {
            addLocation(values.name, values.description, values.urls, values.coordinates).then(() => console.log("post added"))
            resetForm();
        }
    })

    const handleMapClick = (coordinates: ICoordinates) => {
        setCoordinates(coordinates)
    }

    const handleChangeFiles = async () => {
        if (filesRef.current?.files === undefined || filesRef.current?.files === null) return
        await Promise.all(Array.from(filesRef.current?.files).map(uploadFile))
            .then(urls => formik.setFieldValue("urls", Array.from(urls)))
    }

    return (
        <div className='add-form-container'>
            <form className='add-form' onSubmit={formik.handleSubmit}>
                <div className='form-title'>Add new location</div>
                <div className="add-form-inputs">
                    <div className='form-left'>
                        <label className='add-form-label first'>Location name
                            <input
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                id={"name"}
                                name={"name"}
                                className='form-input location-name-input' type="text"/>
                        </label>
                        {formik.touched.name && formik.errors.name ?
                            <div className={"error-message"}>{formik.errors.name}</div> : null}
                        <label className='add-form-label last'>Description
                            <textarea
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                id={"description"}
                                name={"description"}
                                className='form-input add-form-textarea'/>
                        </label>
                        {formik.touched.description && formik.errors.description ?
                            <div className={"error-message"}>{formik.errors.description}</div> : null}
                    </div>
                    <div className='form-right'>
                        <div className='add-form-label'>Coordinates</div>
                        <ChangeMarkerMap onMapClick={handleMapClick}/>
                        <div className="add-form-files-field">
                            <div className='add-form-label'>Add photos</div>
                            <label className='add-files-button'>
                                <input
                                    ref={filesRef}
                                    onChange={handleChangeFiles}
                                    id='files' name='files' className='add-file-buton-none' type={"file"} multiple/>
                                +
                            </label>
                            {formik.touched.urls && formik.errors.urls ?
                                <div className={"error-message"}>{formik.errors.urls}</div> : null}
                        </div>
                    </div>
                </div>
                <div className="submit-container">
                    <button type={"submit"} className='submit add-form-submit'>Add post</button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostForm;