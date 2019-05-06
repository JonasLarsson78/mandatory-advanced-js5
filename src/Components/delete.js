import React, {useState, useRef} from 'react';
import {token$} from './store.js';
import { Dropbox } from 'dropbox';
import '../Css/modal.css'




const Delete = (props) => {
    const element = useRef(null);
    const [delFile, updateDelFile] = useState("")

let delModal;

let pointerEvent = "visible"
const del = (e) => {
  updateDelFile(e.target.dataset.path) 
  element.current.style.visibility = "visible"
}

const yes = () => {
      let path = props.folder.substring(5)
        const option = {
            fetch: fetch,
            accessToken: token$.value
          };
    
          const dbx = new Dropbox(
            option,
          );
    
          dbx.filesDeleteV2({
            path: delFile,
          })
          .then(response => {
            
            dbx.filesListFolder({
            path: path,
          
                }).then(response =>{
                  props.thumbnailUpdate([])
                  props.dataUpdate(response.entries)

                        dbx.filesGetThumbnailBatch({
                          entries: response.entries.map(entry => {
                          return{
                            path: entry.id,
                            format : {'.tag': 'jpeg'},
                            size: { '.tag': 'w32h32'},
                            mode: { '.tag': 'strict' }  
                            }
                          }) 
                        }) 
                        .then(response => {   
                          
                          props.thumbnailUpdate(response.entries)
                          })
                          .catch(function(error) {
                            console.log(error);
                          });
                  
                })
                .catch(function(error) {
                  console.log(error);
                });
          })
          .catch(function(error) {
            console.log(error);
          });
    
    element.current.style.visibility = "hidden"
    element.current.style.zIndex = "0";
}

const no = () => {
    element.current.style.visibility = "hidden"
    element.current.style.zIndex = "0";
}

delModal = <div style={{pointerEvents: pointerEvent}} ref={element} className="modalBack">
<div style={{pointerEvents: pointerEvent}} className="modal">
    <div style={{pointerEvents: pointerEvent}} className="mainModal">
        <h2 style={{color: "black"}}>Delete ! ! !</h2>
        <p className="modalText">Do you want to delete the file / folder ??</p>
        <button className="modalBtn yes"  onClick={yes}>YES</button><button className="modalBtn no" onClick={no}>NO</button>
    </div>
  </div>
</div>

return (
    <>
    {delModal}
    <button className="listBtn" onClick={del}> <i data-path={props.path} className="material-icons">delete_outline</i></button>
    </>
)

}
export default Delete;