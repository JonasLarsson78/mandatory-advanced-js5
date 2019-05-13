import React, {useState, useRef, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import { token$ } from './store.js';
import {Link}from "react-router-dom";
import { HashRouter as Router} from "react-router-dom";
import ModalBreadcrumbs from './modalbreadcrumb.js'
import '../Css/movefiles.css';


const CopyFiles = (props) => {
    const moveModal = useRef(null);
    const moveMessRef = useRef(null);
    const [moveError, updateMoveError] = useState("")
    const [movePath, updateMovePath] = useState("")
    const [startPath, updateStartPath] = useState("")
    const [fileTransfer, updateFileTransfer] = useState("")
    const [showModal, updateShowModal] = useState(false)
    const [data, updateData] = useState([]);
    let moveFolders = '';
    const path = window.decodeURIComponent(window.location.hash.slice(1));


    //console.log(props.folder)
    //console.log(props.path)
    //console.log(startPath)

    //console.log(path)
    /*========= API Request for List folders =========*/
    useEffect((e) => {
     // console.log('Render copyfiles')
      if (!showModal) {
        moveModal.current.style.display = 'none';
        
      } else {
        document.body.style.overflowY = "hidden"
        moveModal.current.style.display = 'block';
        
        const option = {
          fetch: fetch,
          accessToken: token$.value
      };
      const dbx = new Dropbox(
        option,
      );
  
      if (path === '/'){
        dbx.filesListFolder({
          path: '',
        })
        .then(response => {
          updateData(response.entries)          
        })
        .catch(error => {
          console.log(error);
        }); 
       } else {
        dbx.filesListFolder({
          path: path,
        })
        .then(response => {
          updateData(response.entries)
        })
        .catch(error => {
          console.log(error);
        }); 
      }
    }
    }, [showModal, path]);

  useEffect(() => {
    if (!showModal) {
      window.location.hash = "/";
    }
  }, [showModal]);

  const startModal = (path) => {
   updateShowModal(true)
   updateStartPath(path)
  }

  const setPath = (e) => {
    updateMovePath(e.target.dataset.id)

  }

      /*========= API Request for move files =========*/

  const moveToFolder = () => {
      if (startPath === movePath) {
        updateMoveError('You cant move files in same directory')
      } else {
        let index = startPath.lastIndexOf("/")
        let newName = startPath.substring(index)
        updateMoveError('')
    
        const option = {
            fetch: fetch,
            accessToken: token$.value
          };
          const dbx = new Dropbox(
            option,
          );
          dbx.filesCopyV2({
            from_path: startPath,
            to_path: movePath + newName,
            autorename: true
          })
          .then(response => {
              //console.log(response.entries)
            updateFileTransfer('File Moved')
            dbx.filesListFolder({
              path: movePath,
            })
            .then(response => {
                closeModal() 






            })
            .catch(error => {
              console.log(error);
            }); 
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
 /*==================*/

  const renderModalData = (data) => {
    //console.log(startPath)
    //console.log(data.path_lower)
    if(data[".tag"] === 'folder'){ //FOLDER
      return( //FOLDERS
        <tr key={data.id} className="modal-movefiles-tr" data-name={data.name} data-folder={data.path_display} data-tag={data[".tag"]}>
          <td key={data.id} className="modal-movefiles-td-icon">
          <i className="material-icons filesFolders">folder</i>
          </td>
          <td className="modal-movefiles-td-link">
          <Link to={ data.path_lower } className="modal-movefiles-link" onClick={ setPath } data-id={ data.path_display }>{ data.name }</Link>
          </td>
        </tr>
          )
        } 
  }

  let mapping = data.map(renderModalData)

  const closeModal = () => {
      updateShowModal(false)
      updateMovePath('')
      updateStartPath('')
      document.body.style.overflowY = "auto"
  }

    moveFolders = 
    <Router>
      <div className="moveBack" ref={ moveModal }>
    <div className="moveModal" >
    <h3 className="movefiles-h3">Copy files</h3>
    <ModalBreadcrumbs />
    <p className="movefiles-p">Copy <span className="movefiles-file">{ props.name }</span> ... to ... <span className="movefiles-file">{ movePath.slice(1)}</span></p>
    <p>{ fileTransfer }</p>
    <table>
      <tbody>
      { mapping }
      </tbody>
    </table>
    { moveError }
    <button className="modal-movefiles-button" onClick={moveToFolder}>Move</button>
    <i className="material-icons upload-close" onClick={closeModal}>close</i>
    <p ref={moveMessRef} style={{display: "none"}}>{props.name} moved...</p>
    </div>
    </div>
    </Router>
  
    
    return (
        <>
        { moveFolders }
        <button className="listBtn" onClick={ () => startModal(props.path) }> <i className="material-icons copyfiles-icon">file_copy</i></button>
        </>

    )

}

export default CopyFiles;