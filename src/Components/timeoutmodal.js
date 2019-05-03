import React, {useState, useRef} from 'react';

import '../Css/modal.css'

const TimeOutModal = (props) => {

  const element = useRef(null);
    let pointerEvent = "none"

    if (props.showTimeout === true){
        pointerEvent = "auto"
        element.current.style.opacity = "1";
        element.current.style.zIndex = "100";
    }
    
    const reload = () => {
        
        element.current.style.opacity = "0";
        element.current.style.zIndex = "0";
        props.resetTime(null)
        props.showModal3(false)
    }

    

    return(
        <div style={{pointerEvents: pointerEvent}} ref={element} className="modalBack">
            <div style={{pointerEvents: pointerEvent}} className="modal">
                <div style={{pointerEvents: pointerEvent}} className="mainModal">
                    <h1>You have been inactive too long</h1>
                    <p>Press Reload to reload MyBox</p>
                    <button className="modalBtn2" onClick={reload}>Reload</button>
                </div>
            </div>
        </div>
    );
}


export default TimeOutModal;