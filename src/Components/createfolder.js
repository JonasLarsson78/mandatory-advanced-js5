import React, {useState, useRef } from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import { getThumbnails } from './getthumbnails'
import '../Css/createfolder.css';

//import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";


const CreateFolder = (props) => {
 

  const [input, updateInput] = useState('')
  const [hide, updateHide] = useState("none");
  let newFolder = props.folder
  newFolder = newFolder.substring(5);

  let uploadFolder = '';
  const uploadModal = useRef(null);


  const changeInput = (e) => {
    updateInput(e.target.value)
  }

  const createFolder = () => {

    const option = {
      fetch: fetch,
      accessToken: token$.value,
      
    };
    const dbx = new Dropbox(
      option,
    );
    dbx.filesCreateFolderV2({
      path: newFolder + '/'+ input,
      autorename: true
    })
    .then(response => { 
       
       setTimeout(() => {
         closeModal();
       }, 2000);

       dbx.filesListFolder({
        path: newFolder,
      
      })
      .then(response => {

        props.thumbnailUpdate([]);
        props.oldDataUpdate(response.entries)
        props.dataUpdate(response.entries)
        
        getThumbnails(dbx, response.entries)
        .then(entries => {   
          
          props.thumbnailUpdate(entries)
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


  }


  const closeModal = () => {
    //uploadModal.current.style.display = 'none';
    updateHide("none")
    props.pollUpdateMode(false)
  }

  const startModal = () => {
    //uploadModal.current.style.display = 'block';
    updateHide("block")
    updateInput("");
    props.pollUpdateMode(true)
  }

  uploadFolder = 
    <div className="upload-modal-folder" style={{display: hide}} ref={ uploadModal }>
      <label htmlFor="folder" className="upload-folder-label">Type in new folder name</label>
      <input className="upload-folder-input" type="text" id="folder" onChange={changeInput} value={input}></input>
      <i className="material-icons upload-close" id="testi" onClick={ closeModal }>close</i>
      <br /><button className="upload-folder-modal-button" onClick={createFolder}>Create new Folder</button>
    </div>


  return(
    <>
      <button className="upload-folder-button" onClick={ startModal }><i className="material-icons-outlined folder-icon-create-folder"> create_new_folder</i>Create new folder</button>
      { uploadFolder }
    </>
  )
}


export default CreateFolder 

/*
<label>Type in new folder name</label>
      <input type="text" onChange={changeInput}></input><br></br>
      <button onClick={createFolder}>Create new Folder</button>
      */