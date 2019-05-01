import React, {useState, useEffect, useRef} from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';




const UploadFile = (props) => {

  const [uploadMessage, updateMessage] = useState(null)

  let newFolder = props.folder
  newFolder = newFolder.substring(5);
  console.log(newFolder)
  const inputRef = useRef(null)
  const upload = (e) => {
    e.preventDefault();
    
    const fileNodeList = inputRef.current.files;
    const filesiZeLimit = 150 * 1024 * 1024;


    const fileList = Array.from(fileNodeList)
  
    const option = {
      fetch: fetch,
      accessToken: token$.value,
      
    };
    const dbx = new Dropbox(
      option,
    );
    
    
    for(let i = 0; i < fileList.length; i++){
     
      if(fileList[i].size < filesiZeLimit){
        console.log(fileList[i])
        dbx.filesUpload({  
          
          contents: fileList[i],
          path: newFolder + '/' + fileList[i].name
          })

              .then(function(response) {
                updateMessage('Upload done')
                setTimeout(() => {
                  updateMessage(null)
                }, 3000);
                
                props.upload(response)
                console.log(props)
                console.log(response);
              })
              .catch(function(error) {
                console.error(error);
              });


      }
      else{
        const maxBlob = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size
        var workItems = [];     
      
        var offset = 0;
        while (offset < fileList[i].size) {
          var chunkSize = Math.min(maxBlob, fileList[i].size - offset);
          workItems.push(fileList[i].slice(offset, offset + chunkSize));
          offset += chunkSize;
        } 
          
        const task = workItems.reduce((acc, blob, idx, items) => {
          if (idx === 0) {
            console.log(idx)
            // Starting multipart upload of file
            return acc.then(function() {
              console.log('start')
              updateMessage('Upload in progress...')
         

              return dbx.filesUploadSessionStart({ close: false, contents: blob})
                        .then(response => response.session_id)
            });          
          } else if (idx < items.length-1) { 
            console.log('append') 
            // Append part to the upload session
            return acc.then(function(sessionId) {
             var cursor = { session_id: sessionId, offset: idx * maxBlob };
             return dbx.filesUploadSessionAppendV2({ cursor: cursor, close: false, contents: blob }).then(() => sessionId); 
            });
          } else {
            // Last chunk of data, close session
            return acc.then(function(sessionId) {
              var cursor = { session_id: sessionId, offset: fileList[i].size - blob.size };
              var commit = { path: newFolder + '/' + fileList[i].name, mode: 'add', autorename: true, mute: false };              
              return dbx.filesUploadSessionFinish({ cursor: cursor, commit: commit, contents: blob });           
            });
          }          
        }, Promise.resolve());
        
        task.then(function(result) {
          
          //props.upload(result)
          updateMessage('Upload done')
          setTimeout(() => {
            updateMessage(null)
          }, 3000);
          console.log(result)
        })
        .catch(function(error) {
          console.error(error);
        });
        
      }
        
        
      
      


    } 
    
   






  }

  return(
    <>
    <input type="file" multiple ref={inputRef}></input>
    <input type="submit" onClick={upload}></input>
    <label>{uploadMessage}</label>
    </>
  )
  
}

export default UploadFile;