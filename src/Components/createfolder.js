import React, {useState, useRef } from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import '../Css/createfolder.css';

//import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";


const CreateFolder = (props) => {
 

  const [input, updateInput] = useState('')
  const inputRef = useRef(null);
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
       console.log(response)
       
       setTimeout(() => {
         closeModal();
       }, 2000);
       console.log(newFolder)
   
       
       console.log(newFolder)
       dbx.filesListFolder({
        path: newFolder,
      
      })
      .then(response => {
        console.log(response)

        props.thumbnailUpdate([]);
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


   
   

  }


  //inputRef.current.value = '';   

  const closeModal = () => {
    uploadModal.current.style.display = 'none';
  }

  const startModal = () => {
    uploadModal.current.style.display = 'block';
    inputRef.current.value = '';
  }

  uploadFolder = 
    <div className="upload-modal-folder" ref={ uploadModal }>
      <label htmlFor="folder" className="upload-folder-label">Type in new folder name</label>
      <input className="upload-folder-input" type="text" id="folder" onChange={changeInput} ref={inputRef}></input>
      <i className="material-icons upload-close" onClick={ closeModal }>close</i>
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