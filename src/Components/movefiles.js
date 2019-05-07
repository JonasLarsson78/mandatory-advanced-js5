import React, {useState, useRef, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import { token$ } from './store.js';
import {Link}from "react-router-dom";
import ModalBreadcrumbs from './breadcrumbs.js'
import '../Css/movefiles.css';

const MoveFiles = (props) => {
    const moveModal = useRef(null);
    const [oldPath, updateOldPath] = useState('path')
    const [data, updateData] = useState([]);
    let moveFolders = '';
    //console.log(props)

  const startModal = (path) => {
    //const path = props.folder
    console.log(path)
    //updateOldPath(path)
    
    const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    const dbx = new Dropbox(
      option,
    );

    if (path === '/home'){
      dbx.filesListFolder({
        path: '',

      })
      .then(response => {
        updateData(response.entries)          
        //console.log(response.entries) 
      })
      .catch(error => {
        console.log(error);
      }); 
     } else {
      
      dbx.filesListFolder({
        path: path,
      })
      .then(response => {
        console.log(response.entries) 
        updateData(response.entries)          
        
      })
      .catch(error => {
        console.log(error);
      }); 
    }
    moveModal.current.style.display = 'block';
  }
  //console.log(oldPath)


  const renderModalData = (data) => {
    if(data[".tag"] === 'folder'){ //FOLDER
      return( //FOLDERS
        <tr key={data.id} className="" data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}>
          <td>
          <i className="material-icons filesFolders">folder</i>
          </td>
          <td>
            <div onClick={ () => startModal(data.path_lower)}>{data.name}</div>
          </td>
        </tr>
          )
        } 
  }

  let mapping = data.map(renderModalData)

  const closeModal = () => {
      moveModal.current.style.display = 'none';
  }


    moveFolders = <div className="moveModal" ref={ moveModal }>
    <ModalBreadcrumbs />
    <p>Move your file</p>
    <table>
      <tbody>
      { mapping }
      </tbody>
    </table>
    <i className="material-icons upload-close" onClick={ closeModal }>close</i>
    </div>

    return (
        <>
        { moveFolders }
        <button className="listBtn" onClick={ () => startModal(props.folder) }> <i className="material-icons">swap_horiz</i></button>
        </>

    )

}

export default MoveFiles;




    /*========= API Request =========
    
    const callFiles = (folder, newFolder) => {
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