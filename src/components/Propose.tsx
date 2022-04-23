import React, {FC} from 'react';
import {IPropose} from "../types";
import Slider from "./Slider";
import {addImageToLocation, deletePropose} from "../firebase/firebase";
import {useNavigate} from "react-router-dom";

interface IProposeProps {
    propose: IPropose,
    filterProposes: (id: string) => void
}

const Propose: FC<IProposeProps> = ({propose, filterProposes}) => {
    const navigate = useNavigate();
    const onConfirm = () => {
        if (!propose.location.id || !propose.images || !propose.id) return
        addImageToLocation(propose.location.id, propose.images, propose.id).then(() => console.log("confirmed"))
        filterProposes(propose.id)
    }
    const onDecline = () => {
        if (!propose.id) return
        deletePropose(propose.id, propose.images).then(() => console.log("declined"))
        filterProposes(propose.id)
    }
    const handleProfileNavigate = (id:string) => {
        navigate(`/profile/${id}`)
    }
    return (
        <div className='propose-item'>
            <div className='propose-text'>
                <div className='propose-title'>{propose.location.name}</div>
                <div className='propose-author' onClick={()=>handleProfileNavigate(propose.author.uid)}>
                    <div className="propose-avatar">{propose.author.name.substr(0, 1)}</div>
                    <div className="propose-avatar-title">{propose.author.name}</div>
                </div>
                <div className="propose-buttons">
                    <button className='propose-button' onClick={onConfirm}><span className='add-button'>+</span>Confirm</button>
                    <button className='propose-button' onClick={onDecline}><span
                        className='add-button delete-button'>+</span>Decline
                    </button>
                </div>
            </div>
            {propose.images.length > 1 ?
                <div className='propose-item-img-container'><Slider images={propose.images}/></div> :
                <div className='propose-item-img-container'><img className='propose-item-img' src={propose.images[0]}
                                                                 alt={""}/></div>
            }
        </div>
    );
};

export default Propose;