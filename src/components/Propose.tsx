import React, {FC} from 'react';
import {IPropose} from "../types";
import Slider from "./Slider";
import {addImageToLocation, deletePropose} from "../firebase/firebase";

interface IProposeProps {
    propose: IPropose,
    filterProposes: (id: string) => void
}

const Propose: FC<IProposeProps> = ({propose, filterProposes}) => {

    const onConfirm = () => {
        if (!propose.location.id || !propose.images || !propose.id) return
        addImageToLocation(propose.location.id, propose.images, propose.id).then(() => console.log("confirmed"))
        filterProposes(propose.id)
    }
    const onDecline = () => {
        if (!propose.id) return
        deletePropose(propose.id).then(() => console.log("declined"))
        filterProposes(propose.id)
    }

    return (
        <div>
            <div>
                <h4>{propose.location.name}</h4>
                <div>{propose.author.name}</div>
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={onDecline}>Decline</button>
            </div>
            <div>
                {propose.images.length > 1 ?
                    <Slider images={propose.images}/> :
                    <div><img src={propose.images[0]} alt={""}/></div>
                }
            </div>
        </div>
    );
};

export default Propose;