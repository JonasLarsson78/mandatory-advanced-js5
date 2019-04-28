import React, {useState, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";


const CreateFolder = (props) => {

  const [input, updateInput] = useState('')
  let newFolder = props.folder
  newFolder = newFolder.substring(5);
  console.log(newFolder)

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
        
        

        
    })
    .catch(function(error) {
        console.log(error);
    });

  }

  return(
    <>
      <label>Type in new folder name</label>
      <input type="text" onChange={changeInput}></input><br></br>
      <button onClick={createFolder}>Create new Folder</button>
    </>
  )
}


export default CreateFolder 