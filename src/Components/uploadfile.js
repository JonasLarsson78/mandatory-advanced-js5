import React, {useState,useRef} from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import '../Css/upload.css';
import { getThumbnails } from './getthumbnails';
import { errorFunction } from './error.js'



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
    console.log(fileNodeList)
    if(fileNodeList.length === 0){
      return;
    }

    const filesiZeLimit = 150 * 1024 * 1024;
    const fileList = Array.from(fileNodeList)
    
    

    const option = {
      fetch: fetch,
      accessToken: token$.value,
    };
    const dbx = new Dropbox (
      option,
    );
 
    
    
      updateMessage(<><div>Upload in progress</div><div className="uploadLds-ring"><div></div><div></div><div></div><div></div></div></>)
      
      

    
      if(fileList[0].size < filesiZeLimit){
       
        dbx.filesUpload({  
          
          contents: fileList[0],
          path: newFolder + '/' + fileList[0].name,
         
          })

              .then(function(response) {
                updateMessage('Upload done')
                setTimeout(() => {
                  closeModal();
                  updateMessage(null)
                }, 2500);
                
               // props.upload(response)
                console.log(props)       
                console.log(response);

                dbx.filesListFolder({
                  path: newFolder,
                })
                .then(response => {
                  console.log(response)
                  props.thumbnailUpdate([]);
                  props.dataUpdate(response.entries)
                  props.oldDataUpdate(response.entries)
                  getThumbnails(dbx, response.entries)
                  .then(entries => {   
                    props.thumbnailUpdate(entries)
                    })
                    .catch(function(error) {
                      errorFunction(error, props.updateErrorMessage)
                      console.log('UploadFile Thumbnail 67');
                     });
                })
                .catch(function(error) {
                  errorFunction(error, props.updateErrorMessage)
                  console.log('UploadFile FileListFolder 72');
                 });
              })
              .catch(function(error) {
                errorFunction(error, props.updateErrorMessage)
                  console.log('UploadFile FileUpload 77');
              });
      } else {
        const maxBlob = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size
        var workItems = [];     
      
        var offset = 0;
        while (offset < fileList[0].size) {
          var chunkSize = Math.min(maxBlob, fileList[0].size - offset);
          workItems.push(fileList[0].slice(offset, offset + chunkSize));
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
              var cursor = { session_id: sessionId, offset: fileList[0].size - blob.size };
              var commit = { path: newFolder + '/' + fileList[0].name, mode: 'add', autorename: true, mute: false };              
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
          dbx.filesListFolder({
            path: newFolder,
          })
          .then(response => {
            console.log(response)
            props.thumbnailUpdate([]);
            props.dataUpdate(response.entries)
            props.oldDataUpdate(response.entries)
            getThumbnails(dbx, response.entries)
            .then(entries => {   
              props.thumbnailUpdate(entries)
              })
              .catch(function(error) {
                errorFunction(error, props.updateErrorMessage)
                  console.log('UploadFile Thumbnail 138');
            });
          })
          .catch(function(error) {
            errorFunction(error, props.updateErrorMessage)
            console.log('UploadFile FileListFolder 143');
           });
        })
        .catch(function(error) {
          errorFunction(error, props.updateErrorMessage)
          console.log('UploadFile Filesupload 148');
        });
      }
        

    
    
   inputRef.current.value = '';
  }

    const closeModal = () => {
      uploadModal.current.style.display = 'none';
      props.pollUpdateMode(false)
      props.updateErrorMessage('')
    }

    const startModal = () => {
      uploadModal.current.style.display = 'block';
      props.pollUpdateMode(true)
    }

      uploadFile = <div className="upload-modal-files" ref={ uploadModal }>
      <input type="file" className="upload-input" ref={inputRef}></input>
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