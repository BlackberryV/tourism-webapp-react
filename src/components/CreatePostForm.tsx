import React, {FC, useRef, useState} from 'react';
import ChangeMarkerMap from "./ChangeMarkerMap";
import {ICoordinates} from "../types";
import {addLocation} from "../firebase/firebase";
import {uploadFile} from "../firebase/firebase";

const CreatePostForm: FC = () => {
    const nameRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const [coordinates, setCoordinates] = useState<null | ICoordinates>({
        lat: 50.44827739983516,
        lng: 30.524597066687424
    })
    const filesRef = useRef<HTMLInputElement>(null)

    const [urls, setUrls] = useState<string[]>([]);

    const handleMapClick = (coordinates: ICoordinates) => {
        setCoordinates(coordinates)
    }

    const handleChangeFiles = () => {
        if (filesRef.current?.files === undefined || filesRef.current?.files === null) return
        Promise.all(Array.from(filesRef.current?.files).map(uploadFile)).then(setUrls)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nameRef.current?.value === undefined
            || descriptionRef.current?.value === undefined
            || coordinates === null
            || urls.find(e => e === undefined)
        ) return
        addLocation(
            nameRef.current?.value,
            descriptionRef.current?.value,
            urls,
            coordinates).then()
    }

    return (
        <div className='add-form-container'>
            <form className='add-form' onSubmit={handleSubmit}>
                <div className='form-title'>Add new location</div>
                <div className="add-form-inputs">
                    <div className='form-left'>
                        <label className='add-form-label first'>Location name <input className='form-input location-name-input' type="text" ref={nameRef}/></label>
                        <label className='add-form-label last'>Description <textarea className='form-input add-form-textarea' ref={descriptionRef}/></label>
                    </div>
                    <div className='form-right'>
                        <div className='add-form-label'>Coordinates</div>
                        <ChangeMarkerMap onMapClick={handleMapClick}/>
                        <div className="add-form-files-field">
                            <div className='add-form-label'>Add photos</div>
                            <label className='add-files-button'>
                                <input id='file' className='add-file-buton-none' placeholder='+' type={"file"} ref={filesRef} onChange={() => handleChangeFiles()} multiple/>
                                +
                            </label>
                        </div>
                    </div>
                </div>
                <div className="submit-container">
                    <button className='submit add-form-submit' onClick={handleSubmit}>Add post</button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostForm;