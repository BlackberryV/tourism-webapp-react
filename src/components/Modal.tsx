import {FC} from "react";

interface ModalProps {
    active: boolean,
    setActive: (isActive: boolean) => void
}

const Modal: FC<ModalProps> = ({active, setActive, children}) => {
    return (
        <div className={active ? "Modal active" : "Modal"} onClick={() => setActive(false)}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal;