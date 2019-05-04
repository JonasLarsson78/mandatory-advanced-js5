import React, {useState, useEffect,useRef} from 'react';
import {token$} from './store.js';
import { Dropbox } from 'dropbox';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import '../Css/listitems.css';
import { downloadFile } from './dowload'
import moment from 'moment';
import {renameFile} from './rename'
import RenderRename from './renamefunk'



const counter = (number) => {
  if(number === null){
    number = 0;
  }
  return number = number + 1;
  
}

const ListItems = (props) => {
  //const inputEl = useRef(null);
  //const inputElFolder = useRef(null);
  //const clearInput = useRef(null)
  //const clearInputFolder = useRef(null)
  const [data, updateData] = useState([])
  //const [renameFile, updateRenameFile] = useState(false)
  //const [newUrl, updateNewUrl] = useState("")
  const [thumbnails, updateThumbnails] = useState([])

  const searchArr = props.search;
  let toll= -1; //Används för att rendera ut thumbnailArray.

//===============================USEEFFECT=====================================



useEffect(() => {
  
  toll = -1;
  
  const timerToShowModal = window.setTimeout(() => {
    console.log('5 second has passed');
    
    props.showModal3(true)
    //props.resetTime('modal')
   
  }, 480000);
  
    //console.log(timerToShowModal)
  





 
    
  const option = {
    fetch: fetch,
    accessToken: token$.value
  };
  const dbx = new Dropbox(
    option,
  );

  if (props.folder === "/home"){

    dbx.filesListFolder({
      path: '',
    
    })
    .then(response => {

      updateData(response.entries)
      updateThumbnails([]);
        dbx.filesGetThumbnailBatch({
          entries: response.entries.map(entry => {
          return{
            path: entry.id,
            format : {'.tag': 'jpeg'},
            size: { '.tag': 'w32h32'},
            mode: { '.tag': 'strict' }  
            }
          }) 
        }) 
        .then(response => {                
          updateThumbnails(response.entries)
          })

          dbx.filesListFolderLongpoll({
            cursor: response.cursor,
            timeout: 480
           
          })
          .then(response => {
              console.log(response)
              if(response.changes){
                props.pollChanges(counter)
              }
              else if(response.changes === false){
                //props.showModal3(true)
                console.log('root')
              }
              
              
 
          })
          .catch(function(error) {
           console.log(error);
          });

        if (searchArr){
         updateData(searchArr)
        }
    })
    /* .catch(function(error) {
      console.log(error);
    }); */
  }
  
  else{

    let newFolder = props.folder;
    newFolder = newFolder.substring(5)
    
    dbx.filesListFolder({
      path: newFolder,
   
    })
    .then(response => {
      
     updateData(response.entries)
     updateThumbnails([]);

      dbx.filesGetThumbnailBatch({
        entries: response.entries.map(entry => {
          return{
            path: entry.id,
            format : {'.tag': 'jpeg'},
            size: { '.tag': 'w32h32'},
            mode: { '.tag': 'strict' }  
            }
            }) 
          }) 
        .then(response => {         
          updateThumbnails(response.entries)
        }) 

     dbx.filesListFolderLongpoll({
      cursor: response.cursor,
      timeout: 480
    })
    .then(response => {
      //console.log(response.changes)
     
     
      if(response.changes){
        props.pollChanges(counter)
      }
      else if(response.changes === false){
        console.log('folder')
        //props.showModal3(true)
      }
        
        
      
    })
    .catch(function(error) {
     console.log(error);
    });


     if (searchArr){
      updateData(searchArr)
      }
    })
  }
  
  

return () => {
  window.clearTimeout(timerToShowModal);
} 
  
}, [props.folder, props.search, searchArr, props.createFolder, props.uploadFile, props.pollChanges, props, ])
  

  //=================BYTESIZE SETTING======================
  const readableBytes = (bytes) => {
    if (bytes === 0){
      bytes = 1
    }
    const index = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    return (bytes / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + sizes[index];
  }
//==================END BYTESIZE SETTING===================

//==================SET LATEST DATE EDITING================
  const lastEdited = (date) => {
   
    const year = date.substring(0, 4);
    let month = date.substring(5, 7)
    let day = date.substring(8, 10)
    const hour = date.substring(11, 13)
    const minute = date.substring(14, 16)
    const second = date.substring(17, 19)
  

    const months = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    
    month = month.replace(/^0+/, '');
    day = day.replace(/^0+/, '')
    let monthInText = months[month-1];
    

    return <label>{'Last edited: ' + moment(date).fromNow() + ', ' + day + ' ' + monthInText + ' ' + year}</label>
  }
  //================END DATE SET=========================


 //===================RENDER LIST====================
  const renderList = (data) => {
    
    const del = (e) => {
      props.path(e.target.dataset.path) 
      props.showModal(true)
    }

    if(data[".tag"] === 'file'){ //FILER
      toll++;
/*         console.log(data)
        for (let i=toll; i<thumbnails.length;){
            
            return (
              <tr             
              title={"Download: " + data.name} 
              key={data.id} 
              className="listFiles" 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]}
              >
            <td 
              title={"Download: " + data.name} 
              className="listFiles" 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]} onClick={downloadFile}
              >
                <img src={"data:image/jpeg;base64," + thumbnails[toll].thumbnail} />
            </td>
            <td
              title={"Download: " + data.name} 
              className="listFiles" 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]} onClick={downloadFile}
            >
              {data.name} 
            </td>
            <td>
              {readableBytes(data.size)}
            </td>
            <td>
              {lastEdited(data.server_modified)}
            </td>
            <td>
            <button className="listBtn" data-path={data.path_lower} onClick={del}> <i className="material-icons">delete_outline</i></button>
            </td>
            <td>
                  <button className="listBtn" data-path={data.path_lower} onClick={reName}><i data-path={data.path_lower} className="material-icons">edit</i></button>
                </td>
          </tr>
            ) 

          } */

            return( //FILES
              <tr
                  key={data.id} 
                  className="listFiles" 
                  data-name={data.name} 
                  data-folder={data.path_lower} 
                  data-tag={data[".tag"]}
                  >
                <td 
                  title={"Download: " + data.name} 
                  data-name={data.name} 
                  data-folder={data.path_lower} 
                  data-tag={data[".tag"]} onClick={downloadFile}>
                    <i className="material-icons-outlined filesFolders">
                      insert_drive_file
                    </i>
                </td>
                <td
                  title={"Download: " + data.name} 
                  data-name={data.name} 
                  data-folder={data.path_lower} 
                  data-tag={data[".tag"]} onClick={downloadFile}
                >
                {data.name}
                </td>
                <td>
                  {readableBytes(data.size)}
                </td>
                <td>
                  {lastEdited(data.server_modified)}
                </td>
                <td>
                  <button className="listBtn" onClick={del}> <i data-path={data.path_lower} className="material-icons">delete_outline</i></button>
                </td>
                <td>
                  <button className="listBtn" data-path={data.path_lower} onClick={props.rename}><i data-path={data.path_lower} className="material-icons">edit</i></button>
                </td>
              </tr>
            )
          } 
     //Här slutar for-loopen för thumbnails    
     //Här slutar if data=file
    
    if(data[".tag"] === 'folder'){ //FOLDER
      toll++;
      return( //FOLDERS
        <tr key={data.id} className="listFiles" to={data.path_lower} data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}>
          <td>
          <i className="material-icons filesFolders">
            folder
          </i>
          </td>
          <td>
            <Link className="listFolderLink" to={"/home" + data.path_lower}>{data.name}</Link>
          </td>
          <td>
            ...
          </td>
          <td>
            ...
          </td>
          <td>
            <button className="listBtn" onClick={del}> <i data-path={data.path_lower} className="material-icons">delete_outline</i></button>
          </td>
          <td>
            <button className="listBtn" ><i data-path={data.path_lower} className="material-icons" onClick={props.rename2}>edit</i></button> 
          </td>
        </tr>
      )
    } //Här slutar if-folder
  }
    //==================END LIST RENDERING==================

    const replace = () =>{
      window.location.replace("/home")
    }
      
      const listData = data.map(renderList)
  
     
     
  return(
    <>
      {listData}
      <RenderRename rename={props.rename} rename2={props.rename2} renFolder={props.renFolder} renFile={props.renFile}  />
    </>
  )
}

export default ListItems;