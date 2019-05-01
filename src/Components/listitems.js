import React, {useState, useEffect,useRef} from 'react';
import {token$} from './store.js';
import { Dropbox } from 'dropbox';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import '../Css/listitems.css';
import { downloadFile } from './dowload'
import moment from 'moment';
import {renameFile} from './rename'

const counter = (number = 0) => {
  console.log(number)
  return number = number + 1;
  
}

const ListItems = (props) => {
  const inputEl = useRef(null);
  const inputElFolder = useRef(null);
  const clearInput = useRef(null)
  const clearInputFolder = useRef(null)
  const [data, updateData] = useState([])
  const [rename, updateRename] = useState("")
  const [newUrl, updateNewUrl] = useState("")

  const searchArr = props.search;


//===============================USEEFFECT=====================================
  useEffect(() => {
    
    const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    const dbx = new Dropbox(
      option,
    );

    if (props.folder === "/main"){

      dbx.filesListFolder({
        path: ''
      })
      .then(response => {
        updateData(response.entries)


            dbx.filesListFolderLongpoll({
              cursor: response.cursor,
             
            })
            .then(response => {
              console.log(response.changes)
                        
                props.pollChanges(counter)
                
   
            })
            .catch(function(error) {
             console.log(error);
            });

          if (searchArr){
           updateData(searchArr)
          }
      })
      /* .catch(function(error) {
        console.log(error);
      }); */
    }
    
    else{

      let newFolder = props.folder;
      newFolder = newFolder.substring(5)
      
      dbx.filesListFolder({
        path: newFolder
      })
      .then(response => {
       updateData(response.entries)
       dbx.filesListFolderLongpoll({
        cursor: response.cursor,
       
      })
      .then(response => {
        console.log(response.changes)
       
       
          props.pollChanges(counter)
          
          
        
      })
      .catch(function(error) {
       console.log(error);
      });


       if (searchArr){
        updateData(searchArr)
        }
      })
    }
    
    
  
  return
  }, [props.folder, props.search, searchArr, props.createFolder, props.uploadFile, props.pollChanges])

  //==================END OF USEEFFECT======================




  //=================BYTESIZE SETTING======================
  const readableBytes = (bytes) => {
    const index = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    return (bytes / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + sizes[index];
  }
//==================END BYTESIZE SETTING===================

//==================SET LATEST DATE EDITING================
  const lastEdited = (date) => {
   
    const year = date.substring(0, 4);
    let month = date.substring(5, 7)
    const day = date.substring(8, 10)
    const hour = date.substring(11, 13)
    const minute = date.substring(14, 16)
    const second = date.substring(17, 19)
  

    const months = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    
    month = month.replace(/^0+/, '')
    let monthInText = months[month-1];
    

    return <label>{'Last edited: ' + moment(date).fromNow() + ', ' + day + ' ' + monthInText + ' ' + year}</label>
  }
  //================END DATE SET=========================


 let renameInput;
 let renameInputFolder;

 //===================RENDER LIST====================
  const renderList = (data) => {

    const del = (e) => {
      props.path(e.target.dataset.path) 
      props.showModal(true)
    }
/* Rename Files */
    const reName = (e) => {
      let old = e.target.dataset.path
      updateRename(old)
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

      /* let path = window.location.pathname
      setTimeout(startTimer, 700);
        function startTimer() {
          window.location.replace(path)
        }
       clearTimeout(startTimer) */
    }
    const addNewNameClose = () =>{
      inputEl.current.style.display = "none"
    }
    
    renameInput = <div className="listRenameInput" ref={inputEl} style={{display: "none"}}><h3>Rename file:</h3><span className="listRenameClose" onClick={addNewNameClose}>x</span><input style={{outline: "none"}} ref={clearInput} placeholder="New filename..." type="text" onChange={newNameInput} /><button style={{outline: "none"}} className="listBtnRename" onClick={addNewName}>Ok</button></div>
/* ---------------- end renameFiles ----------------------------- */


/* Rename Folder */
const reNameFolder = (e) => {
  let old = e.target.dataset.path
  updateRename(old)
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
  
  console.log(rename)
  console.log(newUrl)
  renameFile(rename, newUrl)
  inputElFolder.current.style.display = "none"
  clearInputFolder.current.value = "";
 /*  let path = window.location.pathname
  setTimeout(startTimer, 700);
    function startTimer() {
      window.location.replace(path)
    }
   clearTimeout(startTimer) */

}
const addNewNameCloseFolder = () =>{
  inputElFolder.current.style.display = "none"
}

renameInputFolder = <div className="listRenameInput" ref={inputElFolder} style={{display: "none"}}><h3>Rename folder:</h3><span className="listRenameClose" onClick={addNewNameCloseFolder}>x</span><input style={{outline: "none"}} ref={clearInputFolder} placeholder="New filename..." type="text" onChange={newNameInputFolder} /><button className="listBtnRename" style={{outline: "none"}} onClick={addNewNameFolder}>Ok</button></div>
/* ---------------- end renameFolder ----------------------------- */
    if(data[".tag"] === 'file'){ //FILER
    
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
              <i className="material-icons-outlined">
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
            <button className="listBtn" onClick={del}> <i data-path={data.path_lower} className="material-icons">delete_outline</i></button>
          </td>
          <td>
            <button className="listBtn" data-path={data.path_lower} onClick={reName}><i data-path={data.path_lower} className="material-icons">edit</i></button>
          </td>
        </tr>
      )
    }
      return( //FOLDERS
        <tr key={data.id} className="listFiles" to={data.path_lower} data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}>
          <td>
          <i className="material-icons">
            folder
          </i>
          </td>
          <td>
            <Link className="listFolderLink" to={"/main" + data.path_lower}>{data.name}</Link>
          </td>
          <td>
          </td>
          <td>
          </td>
          <td>
            <button className="listBtn" onClick={del}> <i data-path={data.path_lower} className="material-icons">delete_outline</i></button>
          </td>
          <td>
            <button className="listBtn" onClick={reNameFolder}><i data-path={data.path_lower} className="material-icons">edit</i></button>
          </td>
        </tr>
      )
    }
    //==================END LIST RENDERING==================

    const replace = () =>{
      window.location.replace("/main")
    }
      
      const listData = data.map(renderList)
      
   let button = "" 
  
   if (searchArr){
    button = <><br/><button className="listBackBtn" onClick={replace}>⟲ Back to files..</button></>
   }
  
  return(
    <>
      {listData}
      
      <tr>
      <td>
        {button}
        {renameInput}
        {renameInputFolder}
      </td>
      </tr>
    </>
  )
}

export default ListItems;