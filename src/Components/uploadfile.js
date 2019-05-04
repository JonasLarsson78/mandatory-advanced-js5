import React, {useState,useRef} from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import '../Css/upload.css';



const UploadFile = (props) => {

  const [uploadMessage, updateMessage] = useState(null)
  let uploadFile = '';

  let newFolder = props.folder
  newFolder = newFolder.substring(5);
  
  const inputRef = useRef(null);
  const uploadModal = useRef(null);
  
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
      updateMessage(<><div>Upload in progress</div><div className="uploadLds-ring"><div></div><div></div><div></div><div></div></div></>)
      if(fileList[i].size < filesiZeLimit){
        console.log(fileList[i])
        dbx.filesUpload({  
          
          contents: fileList[i],
          path: newFolder + '/' + fileList[i].name
          })

              .then(function(response) {
                updateMessage('Upload done')
                setTimeout(() => {
                  closeModal();
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
              updateMessage(<><div>Upload in progress</div><div className="uploadLds-ring"><div></div><div></div><div></div><div></div></div></>)
              
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
            closeModal();
            updateMessage(null)
          }, 3000);
          console.log(result)
        })
        .catch(function(error) {
          console.error(error);
        });
        
      }
        

    } 
    
   inputRef.current.value = '';
  }
    const closeModal = () => {
      uploadModal.current.style.display = 'none';
    }

    const startModal = () => {
      uploadModal.current.style.display = 'block';
    }

  

      uploadFile = <div className="upload-modal-files" ref={ uploadModal }>
      <input type="file" className="upload-input" multiple ref={inputRef}></input>
      <i className="material-icons upload-close" onClick={ closeModal }>close</i>
      <br /><input type="submit" className="upload-submit" onClick={upload} value="Upload files"></input>
      <label className="upload-label">{uploadMessage}</label></div>



  return(
    <>
    <button className="upload-file-button" onClick={ startModal }>Upload files</button>
    { uploadFile }
    </>
  )
  
}

export default UploadFile;