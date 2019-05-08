import React, {useState, useRef, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import { token$ } from './store.js';
import {Link}from "react-router-dom";
import { HashRouter as Router, Redirect} from "react-router-dom";
import ModalBreadcrumbs from './ModalBreadcrumb.js'
import '../Css/movefiles.css';

const MoveFiles = (props) => {
    const moveModal = useRef(null);
    const moveMessRef = useRef(null);
    const [movePath, updateMovePath] = useState("")
    const [startPath, updateStartPath] = useState("")
    const [showModal, updateShowModal] = useState(false)
    const [data, updateData] = useState([]);
    let moveFolders = '';
    const path = window.decodeURIComponent(window.location.hash.slice(1));
    //console.log(path)
    /*========= API Request for List folders =========*/
    useEffect(() => {
      if (!showModal) {
        moveModal.current.style.display = 'none';
      } else {
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
          //console.log(response.entries) 
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
    setTimeout(() => {
      moveMessRef.current.style.display = "block"
    }, 1000);
    
    let name = startPath.lastIndexOf("/")
    let newName = startPath.substring(name)
    console.log(newName)
    console.log(movePath)
    const option = {
        fetch: fetch,
        accessToken: token$.value
      };
      const dbx = new Dropbox(
        option,
      );
      dbx.filesMoveV2({
        from_path: startPath,
        to_path: movePath + newName,
      })
      .then(response => {
        setTimeout(() => {
          closeModal()
        }, 3000);
        
      })
      .catch(error => {
        console.log(error);
      });
    }
 /*==================*/

  const renderModalData = (data) => {
    //console.log(startPath)
    //console.log(data.path_lower)
    if(data[".tag"] === 'folder'){ //FOLDER
      return( //FOLDERS
        <>
        <tr key={data.id} className="" data-name={data.name} data-folder={data.path_display} data-tag={data[".tag"]}>
          <td>
          <i className="material-icons filesFolders">folder</i>
          </td>
          <td>
          <Link to={ data.path_lower } onClick={ setPath } data-id={ data.path_display }>{ data.name }</Link>
          </td>
        </tr>
        </>
          )
        } 
  }

  let mapping = data.map(renderModalData)

  const closeModal = () => {
      updateShowModal(false)
  }

    moveFolders = 
    <Router>
    <div className="moveModal" ref={ moveModal }>
    <ModalBreadcrumbs />
    <p>Move {props.name} ...to:</p>
    <table>
      <tbody>
      { mapping }
      </tbody>
    </table>
    <button onClick={moveToFolder}>Move</button>
    <i className="material-icons upload-close" onClick={closeModal}>close</i>
    <p ref={moveMessRef} style={{display: "none"}}>{props.name} moved...</p>
    </div>
    </Router>
  
    
    return (
        <>
        { moveFolders }
        
        <button className="listBtn" onClick={ () => startModal(props.path) }> <i className="material-icons">swap_horiz</i></button>
        </>

    )

}

export default MoveFiles;





