import React, {useState, useRef} from 'react';
import {token$, favorites$, updateFavoriteToken} from './store.js';
import { Dropbox } from 'dropbox';
import { getThumbnails } from './getthumbnails';
import { errorFunction } from './error.js'
import '../Css/modal.css'


const Delete = (props) => {
    const element = useRef(null);
    const [delFile, updateDelFile] = useState("")

let delModal;

let pointerEvent = "visible"
const del = (e) => {
  props.pollUpdateMode(true)
  updateDelFile(e.target.dataset.path) 
  element.current.style.visibility = "visible"
  element.current.style.zIndex = "500";
  document.body.style.overflowY = "hidden"
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
            for (let i=0; i<favorites$.value.length; i++) {
              if (favorites$.value[i].id === response.metadata.id) {
                  let newArray = [...favorites$.value];
                  newArray.splice(i, 1);
                  updateFavoriteToken(newArray);
            }
          }
            dbx.filesListFolder({
            path: path,
                }).then(response =>{
                  props.thumbnailUpdate([])
                  props.dataUpdate(response.entries)
                  props.oldDataUpdate(response.entries)
                  getThumbnails(dbx, response.entries)
                        .then(entries => {   
                          props.thumbnailUpdate(entries)
                          })
                          .catch(function(error) {
                            errorFunction(error, props.updateErrorMessage)
                            console.log('Delete FilesDelete2 55');
                          });
                })
                .catch(function(error) {
                  console.log('Delete FilesDelete2 61');
                  errorFunction(error, props.updateErrorMessage)
                });
          })
          .catch(function(error) {
            console.log('Delete FilesDelete2 66');
            errorFunction(error, props.updateErrorMessage)
          });
    
    element.current.style.visibility = "hidden"
    //document.body.style.overflowY = "auto"
    element.current.style.zIndex = "0";
    props.pollUpdateMode(false)
}

const no = () => {
    
    element.current.style.visibility = "hidden"
    document.body.style.overflowY = "auto"
    element.current.style.zIndex = "0";
    props.pollUpdateMode(false)
}

delModal = <div style={{pointerEvents: pointerEvent}} ref={element} className="modalBack">
<div style={{pointerEvents: pointerEvent}} className="modal">
    <div style={{pointerEvents: pointerEvent}} className="mainModal">
        <h2 style={{color: "black"}}>Delete ! ! !</h2>
        <p className="modalText">Do you want to delete {props.tag} {props.name} ??</p>
        <button className="modalBtn yes"  onClick={yes}>YES</button><button className="modalBtn no" onClick={no}>NO</button>
    </div>
  </div>
</div>

return (
    <>
    {delModal}
    <button className="listBtn" onClick={del}> <i data-path={props.path} className="material-icons delete-icon">delete_outline</i></button>
    </>
)

}
export default Delete;