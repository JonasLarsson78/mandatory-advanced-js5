import React, {useState,useRef} from 'react';
import { Dropbox } from 'dropbox';
import {token$, favorites$, updateFavoriteToken} from './store.js';

const ReNameFolder = (props) => {
  const inputElFolder = useRef(null);
  const clearInputFolder = useRef(null)
  const [newUrl, updateNewUrl] = useState("");
  const [rename, updateRename] = useState("");

  let renameInputFolder;

  const option = {
    fetch: fetch,
    accessToken: token$.value
  };
  
  const dbx = new Dropbox(
    option,
  );


const reNameFolder = (e) => {
let old = e.target.dataset.path
updateRename(old)

let pos = window.pageYOffset
  let newPos = pos + 300
  inputElFolder.current.style.top = newPos + "px"
  inputElFolder.current.style.display = "block"
}
const newNameInputFolder = (e) => {
let target = e.target.value

let path = rename.split("/");
let strippedPath = path.slice(0, path.length-1).join("/");

let fixNewname = strippedPath + "/" + target;
updateNewUrl(fixNewname);
}

const addNewNameFolder = (e) => {



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
    



inputElFolder.current.style.display = "none"
clearInputFolder.current.value = "";


}
const addNewNameCloseFolder = () =>{
inputElFolder.current.style.display = "none"
}

renameInputFolder = <div className="listRenameInput" ref={inputElFolder} style={{display: "none"}}><div className="listRenameText">Rename folder</div><span className="listRenameClose" onClick={addNewNameCloseFolder}><i className="material-icons">close</i></span><input placeholder="New foldername..." className="listRenameInputText" style={{outline: "none"}} ref={clearInputFolder} type="text" onChange={newNameInputFolder} /><button className="listBtnRename" style={{outline: "none"}} onClick={addNewNameFolder}>Ok</button></div>


return(
  <>
  {renameInputFolder}
  <button className="listBtn" onClick={reNameFolder}><i data-path={props.path} className="material-icons rename-icon">edit</i></button>  </>
)

}

export default ReNameFolder;
