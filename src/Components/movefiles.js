import React, {useState, useRef, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import { token$ } from './store.js';
import {Link}from "react-router-dom";
import '../Css/movefiles.css';

const MoveFiles = (props) => {
    const moveModal = useRef(null);
    const [oldPath, updateOldPath] = useState('path')
    const [data, updateData] = useState([]);
    let moveFolders = '';
    //console.log(props)

  const startModal = (e) => {
    const path = props.path
    console.log(path)
    updateOldPath(path)
    

    const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    const dbx = new Dropbox(
      option,
    );
      dbx.filesListFolder({
        path: '',
      })
      .then(response => {
        updateData(response.entries)          
        
        console.log(response.entries) 
      })
      .catch(error => {
        console.log(error);
      }); 


      moveModal.current.style.display = 'block';
  }




  const renderModalData = (data) => {
    if(data[".tag"] === 'folder'){ //FOLDER
      return( //FOLDERS
        <tr key={data.id} className="listFiles" data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}>
          <td>
          <i className="material-icons filesFolders">folder</i>
          </td>
          <td>
            <Link className="listFolderLink" to={"/home" + data.path_lower}>{data.name}</Link>
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
        <button className="listBtn" onClick={ startModal }> <i className="material-icons">swap_horiz</i></button>
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