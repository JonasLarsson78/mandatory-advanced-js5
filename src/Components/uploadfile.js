import React, {useState, useEffect, useRef} from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';


const UploadFile = () => {
  const inputRef = useRef(null)
  const upload = (e) => {
    e.preventDefault();
    
    const fileNodeList = inputRef.current.files;
    const fileList = Array.from(fileNodeList)

    
    const filesiZeLimit = 150 * 1024 * 1024;

    

    const option = {
      fetch: fetch,
      accessToken: token$.value,
      
    };
    const dbx = new Dropbox(
      option,
    );
    
   
      

     

    
    for(let i = 0; i < fileList.length; i++){
      console.log(fileList[i])

      dbx.filesUpload({  
        
       
       contents: fileList[i],
       path: '/' + fileList[i].name
       })
 
     
 
           .then(function(response) {
             
          
             console.log(response);
           })
           .catch(function(error) {
             console.error(error);
           });

    } 
    
   






  }

  return(
    <>
    <input type="file" multiple ref={inputRef}></input>
    <input type="submit" onClick={upload}></input>
    </>
  )
  
}

export default UploadFile;