import React, {useState, useEffect, useRef} from 'react';
import {token$} from './store.js';
import { Dropbox } from 'dropbox';
import {Link}from "react-router-dom";
import '../Css/listitems.css';
import {readableBytes} from './readablebytes'
import {lastEdited} from './lastedited'
import { downloadFile } from './dowload'
//import {renameFile}  from './rename'
import { Helmet } from "react-helmet";
//import {deleteFiles} from './delete'



/* const counter = (number) => {
  if(number === null){
    number = 0;
  }
  return number = number + 1;
  
} */

const ListItems = (props) => {
 // const element = useRef(null);
 // const inputEl = useRef(null);
 // const inputElFolder = useRef(null);
 // const clearInput = useRef(null)
 // const clearInputFolder = useRef(null)
 // const [rename, updateRename] = useState("")
 // const [newUrl, updateNewUrl] = useState("")
 // const [delFile, updateDelFile] = useState("")
 //const searchArr = props.search;


//===============================USEEFFECT=====================================


/* --------------------------- Rename Files ------------------------------------------- */

/* let renameInput;
let renameInputFolder; */

/* const reName = (e) => {
  let old = e.target.dataset.path
  updateRename(old)
  inputEl.current.style.display = "block"
} */
/* const newNameInput = (e) => {
  let target = e.target.value
  let idx = rename.lastIndexOf('.')
  let newIdx = rename.substring(idx)
  let newPath = rename.substring(0, rename.lastIndexOf("/"));
  let fixNewname = newPath + "/" + target + newIdx;
  updateNewUrl(fixNewname);

 


} */

/* const addNewName = (e) => {
  
  renameFile(rename, newUrl)
  inputEl.current.style.display = "none"
  clearInput.current.value = "";
  

} */

/* const addNewNameClose = () =>{
  inputEl.current.style.display = "none"
} */

/* renameInput = <div className="listRenameInput" ref={inputEl} style={{display: "none"}}><div className="listRenameText"> Rename file</div><span className="listRenameClose" onClick={addNewNameClose}><i className="material-icons">close</i></span><input className="listRenameInputText" style={{outline: "none"}} ref={clearInput} placeholder="New filename..." type="text" onChange={newNameInput} /><button style={{outline: "none"}} className="listBtnRename" onClick={addNewName}>Ok</button></div> */
/* ---------------------------------------- end renameFiles ----------------------------- */


/*------------------------------------------ Rename Folder ----------------------------------*/
/* const reNameFolder = (e) => {
let old = e.target.dataset.path
updateRename(old)
inputElFolder.current.style.display = "block"
} */
/* const newNameInputFolder = (e) => {
let target = e.target.value

let path = rename.split("/");
let strippedPath = path.slice(0, path.length-1).join("/");

let fixNewname = strippedPath + "/" + target;
updateNewUrl(fixNewname);
} */

/* const addNewNameFolder = (e) => {

renameFile(rename, newUrl)
inputElFolder.current.style.display = "none"
clearInputFolder.current.value = "";


} */
/* const addNewNameCloseFolder = () =>{
inputElFolder.current.style.display = "none"
} */

/* renameInputFolder = <div className="listRenameInput" ref={inputElFolder} style={{display: "none"}}><div className="listRenameText">Rename folder</div><span className="listRenameClose" onClick={addNewNameCloseFolder}><i className="material-icons">close</i></span><input placeholder="New foldername..." className="listRenameInputText" style={{outline: "none"}} ref={clearInputFolder} type="text" onChange={newNameInputFolder} /><button className="listBtnRename" style={{outline: "none"}} onClick={addNewNameFolder}>Ok</button></div> */


/* const renameModal = 
     <tr style={{background: "white"}}>
     <td>
       {renameInput}
       {renameInputFolder}
     </td>
    </tr> */


/* ---------------------------------------- end renameFolder ------------------------------------------- */


/* let delModal;
  console.log(props) */
 //===================RENDER LIST====================
 
  const renderList = (data, index) => {
   const thumbs = props.thumbnails[index]

    /*--------------------------  Del------------------------------- */
    
   /*  let pointerEvent = "visible" */
    /* const del = (e) => {
      console.log(e.target.dataset.path)
      updateDelFile(e.target.dataset.path) 
      element.current.style.visibility = "visible"
    } */
    
    /* const yes = () => {
        deleteFiles(delFile)
        element.current.style.visibility = "hidden"
        element.current.style.zIndex = "0";
    } */

    /* const no = () => {
        element.current.style.visibility = "hidden"
        element.current.style.zIndex = "0";
    } */

    /* delModal = <div style={{pointerEvents: pointerEvent}} ref={element} className="modalBack">
    <div style={{pointerEvents: pointerEvent}} className="modal">
        <div style={{pointerEvents: pointerEvent}} className="mainModal">
            <h2>Delete ! ! !</h2>
            <p className="modalText">Do you want to delete the file / folder ??</p>
            <button className="modalBtn yes"  onClick={yes}>YES</button><button className="modalBtn no" onClick={no}>NO</button>
        </div>
      </div>
    </div> */


    /* ---------------------------------------------------------------------- */

    if(data[".tag"] === 'file'){ //FILER
      if(thumbs === undefined){

        return( //FILES
          <tr
              key={data.id} 
              className="listFiles" 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]}
              >
            <td 
              title={"Download: " + data.name} 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]} onClick={downloadFile}>
                <i className="material-icons-outlined filesFolders">
                  insert_drive_file
                </i>
            </td>
            <td
              title={"Download: " + data.name} 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]} onClick={downloadFile}
            >
            {data.name}
            </td>
            <td>
              {readableBytes(data.size)}
            </td>
            <td>
              {lastEdited(data.server_modified)}
            </td>
            <td>
              <button className="listBtn" /* onClick={del} */> <i data-path={data.path_lower} className="material-icons">delete_outline</i></button>
            </td>
            <td>
              <button className="listBtn" data-path={data.path_lower} /* onClick={reName} */><i data-path={data.path_lower} className="material-icons">edit</i></button>
            </td>
            <td>
            <button className="listBtn"> <i className="material-icons">swap_horiz</i></button>
          </td>
          </tr>
        ) 
       }  
       else{
        return( //FILES
          <tr
              key={data.id} 
              className="listFiles" 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]}
              >
            <td 
              title={"Download: " + data.name} 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]} onClick={downloadFile}>
                <img src={"data:image/jpeg;base64," + thumbs.thumbnail} alt=""/>
            </td>
            <td
              title={"Download: " + data.name} 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]} onClick={downloadFile}
            >
            {data.name}
            </td>
            <td>
              {readableBytes(data.size)}
            </td>
            <td>
              {lastEdited(data.server_modified)}
            </td>
            <td>
              <button className="listBtn" /* onClick={del} */> <i data-path={data.path_lower} className="material-icons">delete_outline</i></button>
            </td>
            <td>
              <button className="listBtn" data-path={data.path_lower} /* onClick={reName} */><i data-path={data.path_lower} className="material-icons">edit</i></button>
            </td>
            <td>
            <button className="listBtn"> <i className="material-icons">swap_horiz</i></button>
          </td>
          </tr>
        ) 

      } 



      }
      
  

if(data[".tag"] === 'folder'){ //FOLDER
 console.log(props.match)
return( //FOLDERS
  <tr key={data.id} className="listFiles" data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}>
    <td>
    <i className="material-icons filesFolders">
      folder
    </i>
    </td>
    <td>
      <Link className="listFolderLink" to={"/home" + data.path_lower}>{data.name}</Link>
    </td>
    <td>
      ...s
    </td>
    <td>
      ...
    </td>
    <td>
      <button className="listBtn" /* onClick={del} */> <i data-path={data.path_lower} className="material-icons">delete_outline</i></button>
    </td>
    <td>
      <button className="listBtn" /* onClick={reNameFolder} */><i data-path={data.path_lower} className="material-icons">edit</i></button> 
    </td>
    <td>
      <button className="listBtn"> <i className="material-icons">swap_horiz</i></button>
    </td>
  </tr>
)
} //Här slutar if-folder */
}
//==================END LIST RENDERING==================
    //==================END LIST RENDERING==================

    
      const listData = props.renderData.map(renderList)
  
     
     
  return(
    <>
    <Helmet>
      <title>MyBOX</title>
    </Helmet>
      {listData}
    {/*   {renameModal} */}
      <tr style={{background: "white"}}>
     <td>
      {/*  {delModal} */}
     </td>
    </tr>
      
    </>
  )
}

export default ListItems;