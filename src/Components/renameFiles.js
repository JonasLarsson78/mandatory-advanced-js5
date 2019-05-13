import React, {useState,useRef} from 'react';
import { Dropbox } from 'dropbox';
import {token$, favorites$, updateFavoriteToken} from './store.js';

const RenameFile = (props) => {

  const inputEl = useRef(null);
  const clearInput = useRef(null)
  const [newUrl, updateNewUrl] = useState("");
  const [rename, updateRename] = useState("");


let renameInput;

const option = {
  fetch: fetch,
  accessToken: token$.value
};

const dbx = new Dropbox(
  option,
);


const reName = (e) => {
  let old = e.target.dataset.path
  updateRename(old)
  
  
  inputEl.current.style.display = "block"
  document.body.style.overflowY = "hidden"
}
const newNameInput = (e) => {
  let target = e.target.value
  let idx = rename.lastIndexOf('.')
  let newIdx = rename.substring(idx)
  let newPath = rename.substring(0, rename.lastIndexOf("/"));
  let fixNewname = newPath + "/" + target + newIdx;
  updateNewUrl(fixNewname);
}

const addNewName = (e) => {
  //console.log(props)
  
  dbx.filesMoveV2({
    from_path: rename,
    to_path: newUrl,
    autorename: true
  })
  .then(response => {

    for (let i=0; i<favorites$.value.length; i++) {
      if (favorites$.value[i].id === response.metadata.id) {
          let newArray = [...favorites$.value];
          newArray[i] = response.metadata;
          updateFavoriteToken(newArray);
      }
    }
    dbx.filesListFolder({
      path: props.folder.substring(5),
    
          }).then(response =>{
            props.thumbnailUpdate([])
            props.dataUpdate(response.entries)
            props.oldDataUpdate(response.entries)

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
  .catch(error => {
    console.log(error);
  });




  inputEl.current.style.display = "none"
  document.body.style.overflowY = "auto"
  clearInput.current.value = "";
  

}

const addNewNameClose = () =>{
  inputEl.current.style.display = "none"
  document.body.style.overflowY = "auto"
}

renameInput = 
<div className="reNameBack" ref={inputEl} >
<div className="listRenameInput"><div className="listRenameText"> Rename file</div><span className="listRenameClose" onClick={addNewNameClose}><i className="material-icons">close</i></span><input className="listRenameInputText" style={{outline: "none"}} ref={clearInput} placeholder="New filename..." type="text" onChange={newNameInput} /><button style={{outline: "none"}} className="listBtnRename" onClick={addNewName}>Ok</button></div></div>


return(
  <>
  {renameInput}
  <button className="listBtn" onClick={reName}><i data-path={props.path} className="material-icons rename-icon">edit</i></button>
  </>
)

}

export default RenameFile;
