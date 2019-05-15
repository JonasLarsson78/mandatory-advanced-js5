import React, {useState,useRef} from 'react';
import { Dropbox } from 'dropbox';
import {token$, favorites$, updateFavoriteToken} from './store.js';
import { getThumbnails } from './getthumbnails'
import { errorFunction } from './error.js'

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
  props.pollUpdateMode(true)
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

            getThumbnails(dbx, response.entries)
                  .then(entries => {   
                    
                    props.thumbnailUpdate(entries)
                    })
                    .catch(function(error) {
                      errorFunction(error, props.updateErrorMessage)
                      console.log('RenameFile Thumbnails rad 77');
                      
                    });
            
          })
          .catch(function(error) {
            errorFunction(error, props.updateErrorMessage)
            console.log('RenameFile FilesListFolder rad 84');
          });
  })
  .catch(error => {
    errorFunction(error, props.updateErrorMessage)
    console.log('RenameFile Filesmove rad 89');
  });




  inputEl.current.style.display = "none"
  document.body.style.overflowY = "auto"
  clearInput.current.value = "";
  props.pollUpdateMode(false)

}

const addNewNameClose = () =>{
  inputEl.current.style.display = "none"
  document.body.style.overflowY = "auto"
  props.pollUpdateMode(false)
}

renameInput = 
<div className="reNameBack" ref={inputEl} >

<div className="listRenameInput"><h3 className="movefiles-h3">Rename files</h3>
<div className="renamefile-input-wrapper"><span className="listRenameClose" onClick={addNewNameClose}><i className="material-icons">close</i></span><input className="listRenameInputText" style={{outline: "none"}} ref={clearInput} placeholder="New filename..." type="text" onChange={newNameInput} /><button style={{outline: "none"}} className="renamefile-ok-button" onClick={addNewName}>Ok</button></div></div></div>


return(
  <>
  {renameInput}
  <button className="listBtn" onClick={reName}><i data-path={props.path} className="material-icons rename-icon">edit</i></button>
  </>
)

}

export default RenameFile;
