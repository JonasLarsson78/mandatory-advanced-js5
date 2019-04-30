import React, {useRef} from 'react';
import '../Css/modal.css'

const Modal = (props) => {
    const element = useRef(null);

    if (props.showModal === true){
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
        <div ref={element} className="modalBack">
        <div className="modal">
        <div className="mainModal">
        <h1>Delete</h1>
        <p>Vill du ta bort filen/mappen ??</p>
        <button onClick={ja}>Ja</button><button onClick={nej}>Nej</button>
        </div>
        </div>
        </div>
    );


}

export default Modal;