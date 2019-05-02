import React, {useRef} from 'react';
import '../Css/modal.css'

const Modal = (props) => {
    const element = useRef(null);
    let pointerEvent = "none"

    if (props.showModal === true){
        pointerEvent = "auto"
        element.current.style.opacity = "1";
        element.current.style.zIndex = "100";
    }
    
    const ja = () => {
        console.log(props.delPath)
        props.del(props.delPath);
        element.current.style.opacity = "0";
        element.current.style.zIndex = "0";
        props.showModal2(false)
    }

    const nej = () => {
        element.current.style.opacity = "0";
        element.current.style.zIndex = "0";
        props.showModal2(false)
    }

    return(
        <div style={{pointerEvents: pointerEvent}} ref={element} className="modalBack">
            <div style={{pointerEvents: pointerEvent}} className="modal">
                <div style={{pointerEvents: pointerEvent}} className="mainModal">
                    <h1>Delete</h1>
                    <p>Vill du ta bort filen/mappen ??</p>
                    <button className="modalBtn" onClick={ja}>Ja</button><button className="modalBtn" onClick={nej}>Nej</button>
                </div>
            </div>
        </div>
    );


}

export default Modal;