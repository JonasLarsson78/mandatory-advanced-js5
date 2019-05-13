import React, {useState, useRef, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import {token$, favorites$, updateFavoriteToken} from './store.js';
import {Link}from "react-router-dom";
import { HashRouter as Router} from "react-router-dom";
import ModalBreadcrumbs from './modalbreadcrumb.js'
import { getThumbnails } from './getthumbnails'
import '../Css/movefiles.css';


const MoveFiles = (props) => {
  
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


    /*========= API Request for List folders =========*/
    useEffect((e) => {
     // console.log('Render ...moveFiles')
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
          let arr = []
          let data = response.entries
          for (let i = 0; i < data.length; i++) {
            if (data[i].path_lower !== props.path)
              arr.push(data[i])
          }
          updateData(arr)  
        })
        .catch(error => {
          console.log(error);
        }); 
       } else {
        
        dbx.filesListFolder({
          path: path,
        })
        .then(response => {
          let arr = []
          let data = response.entries
          for (let i = 0; i < data.length; i++) {
            if (data[i].path_lower !== props.path)
              arr.push(data[i])
          }
          updateData(arr) 
        })
        .catch(error => {
          console.log(error);
        }); 
      }
    }

    }, [showModal, path, props.path]);

  useEffect(() => {
    if (!showModal) {
      window.location.hash = "/";

    }
  }, [showModal]);

  const startModal = (path) => {
    props.pollUpdateMode(true)
   updateShowModal(true)
   updateStartPath(path)
  }
  let newName2 = startPath.substring(0, startPath.lastIndexOf("/")); 
  const setPath = (e) => {
    updateMovePath(e.target.dataset.id)
  }

/*========= API Request for move files =========*/

  const moveToFolder = () => {
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
          dbx.filesMoveV2({
            from_path: startPath,
            to_path: movePath + newName,
            autorename: false
          })
          .then(response => {

            for (let i=0; i<favorites$.value.length; i++) {
              if (favorites$.value[i].id === response.metadata.id) {
                  let newArray = [...favorites$.value];
                  newArray[i] = response.metadata;
                  updateFavoriteToken(newArray);
              }
            }

            updateFileTransfer('File transfered')
            dbx.filesListFolder({
              path: newName2,
          })
          .then(response => {
            console.log(props)
            props.thumbnailUpdate([]);
            props.oldDataUpdate(response.entries)
            props.dataUpdate(response.entries)

            getThumbnails(dbx, response.entries)

            
            .then(entries => {   
              updateMoveError("")
              props.thumbnailUpdate(entries)
              })
              .catch(function(error) {
                console.log(error);
               });

          })
            .catch(error => {
              console.log(error);
          }); 
        })
        .catch(error => {
          console.log(error);
          updateMoveError("File / Folder with the same name already exists!")
        });
        props.pollUpdateMode(false)
    }
 /*==================*/
 
  const renderModalData = (data) => {
    
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
      props.pollUpdateMode(false)
  }
  

 

  

    moveFolders = 
    <Router>
      <div ref={ moveModal } className="moveBack">
    <div className="moveModal" >
    <h3 className="movefiles-h3">Move files</h3>
    <ModalBreadcrumbs />
    <p className="movefiles-p">Move <span className="movefiles-file">{props.name}</span> ... to ... <span className="movefiles-file">{ movePath.slice(1)}</span></p>
    <p>{ fileTransfer }</p>
    <table>
      <tbody>
      { mapping }
      </tbody>
    </table>
    { moveError }
    <button className="modal-movefiles-button" onClick={ moveToFolder }>Move</button>
    <i className="material-icons upload-close" onClick={closeModal}>close</i>
    <p ref={moveMessRef} style={{display: "none"}}>{props.name} moved...</p>
    </div>
    </div>
    </Router>
  
    
    return (
        <>
        { moveFolders }
        <button className="listBtn" onClick={ () => startModal(props.path) }> <i className="material-icons movefiles-icon">swap_horiz</i></button>
        </>

    )

}

export default MoveFiles;





