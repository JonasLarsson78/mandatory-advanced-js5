import React, {useState, useRef} from 'react';
import { Dropbox } from 'dropbox';
import { token$ } from './store.js';
//import '../Css/movefiles.css';

const MoveFiles = (props) => {
    const moveModal = useRef(null);
    let moveFolders = '';


    /*========= API Request =========
    
    const MoveFiles = (folder, newFolder) => {
    const option = {
        fetch: fetch,
        accessToken: token$.value
      };
      const dbx = new Dropbox(
        option,
      );
      dbx.filesMoveBatchV2({
        from_path: folder,
        to_path: newFolder,
        autorename: true
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error);
      });
}
*/


    moveFolders = <div className="moveModal" ref={ moveModal }>
    <p>test</p>
    <label className="upload-label"></label></div>
/*
    const startModal = () => {
        moveModal.current.style.display = 'block';
    }
    startModal();

    const closeModal = () => {
        moveModal.current.style.display = 'none';
    }



    moveFolders = <div className="upload-modal-files" ref={ moveModal }>
    <input type="file" className="upload-input" multiple ref={ inputRef }></input>
    <i className="material-icons upload-close" onClick={ closeModal }>close</i>
    <br /><input type="submit" className="upload-submit" onClick={upload} value="Upload files"></input>
    <label className="upload-label">{uploadMessage}</label></div>
    
*/

    return (
        <>
        <button className="listBtn"> <i className="material-icons">swap_horiz</i></button>
        </>

    )

}

export default MoveFiles;