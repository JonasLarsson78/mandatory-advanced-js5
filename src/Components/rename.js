import React, {useState, useRef} from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';

const RenderRename = (props) => {
    let renameInput;
    let renameInputFolder;

  const inputEl = useRef(null);
  const inputElFolder = useRef(null);
  const clearInput = useRef(null)
  const clearInputFolder = useRef(null)
  const [newUrl, updateNewUrl] = useState("")

  let rename = props.renFile
  let renameFolder = props.renFolder

/*  API Request */
  const renameFile = (name, newName) => {

    const option = {
        fetch: fetch,
        accessToken: token$.value
      };

      const dbx = new Dropbox(
        option,
      );

      dbx.filesMoveV2({
        from_path: name,
        to_path: newName,
        autorename: true
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error);
      });

}
    
/* Rename Files */
    
    const reName = () => {
      inputEl.current.style.display = "block"
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
      renameFile(rename, newUrl)
      inputEl.current.style.display = "none"
      clearInput.current.value = "";
      props.rename(e)
      
    }

    const addNewNameClose = () =>{
      inputEl.current.style.display = "none"
    }
    
    renameInput = <div className="listRenameInput" ref={inputEl} style={{display: "none"}}><div className="listRenameText"> Rename file</div><span className="listRenameClose" onClick={addNewNameClose}><i className="material-icons">close</i></span><input className="listRenameInputText" style={{outline: "none"}} ref={clearInput} placeholder="New filename..." type="text" onChange={newNameInput} /><button data-path={null} style={{outline: "none"}} className="listBtnRename" onClick={addNewName}>Ok</button></div>
/* ---------------- end renameFiles ----------------------------- */


/* Rename Folder */
const reNameFolder = (e) => {
  inputElFolder.current.style.display = "block"
}
const newNameInputFolder = (e) => {
  let target = e.target.value
  let path = renameFolder.split("/");
  let strippedPath = path.slice(0, path.length-1).join("/");
  
  let fixNewname = strippedPath + "/" + target;
  updateNewUrl(fixNewname);
}

const addNewNameFolder = (e) => {
  renameFile(renameFolder, newUrl)
  inputElFolder.current.style.display = "none"
  clearInputFolder.current.value = "";
  props.rename2(e)
 
}
const addNewNameCloseFolder = () =>{
  inputElFolder.current.style.display = "none"
}

renameInputFolder = <div className="listRenameInput" ref={inputElFolder} style={{display: "none"}}><div className="listRenameText">Rename folder</div><span className="listRenameClose" onClick={addNewNameCloseFolder}><i className="material-icons">close</i></span><input placeholder="New foldername..." className="listRenameInputText" style={{outline: "none"}} ref={clearInputFolder} type="text" onChange={newNameInputFolder} /><button className="listBtnRename" style={{outline: "none"}} data-path={null} onClick={addNewNameFolder}>Ok</button></div>
/* ---------------- end renameFolder ----------------------------- */


if (props.renFile){
    reName()
}
if (props.renFolder){
    reNameFolder()
}
    
return(
    <>
    <tr style={{background: "white"}}>
      <td>
        {renameInput}
        {renameInputFolder}
      </td>
      </tr>
    </>
)
  }
  export default RenderRename;