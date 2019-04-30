import React, {useState, useEffect} from 'react';
import {token$} from './store.js';
import { Dropbox } from 'dropbox';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import '../Css/listitems.css';
import { downloadFile } from './dowload'
import { deleteFiles } from './delete'
import moment from 'moment';
import Modal from './modal.js';


const ListItems = (props) => {

  const [data, updateData] = useState([])
  const [rename, updateRename] = useState(false)
  const [name, updateName] = useState("")
  const [thumbnails, updateThumbnails] = useState([])

  const searchArr = props.search;

  useEffect(() => {
    
   
    const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    const dbx = new Dropbox(
      option,
    );

    if (props.folder === "/main"){

      dbx.filesListFolder({
        path: ''
      })
      .then(response => {
        updateData(response.entries)

        
          if (searchArr){
           updateData(searchArr)
    }
        
      })
      .catch(function(error) {
        console.log(error);
      });
    }
    
    else{

let newFolder = props.folder;
      newFolder = newFolder.substring(5)

      
      dbx.filesListFolder({
        path: newFolder
      })
      .then(response => {
       updateData(response.entries)
       if (searchArr){
        updateData(searchArr)
 }


        dbx.filesGetThumbnailBatch({
          entries: response.entries.map(entry => {
            return{
              path: entry.id,
              format : {'.tag': 'jpeg'},
              size: { '.tag': 'w2048h1536'},
              mode: { '.tag': 'strict' }  
            }
          } )
          
          
        })
        .then(response => {
          const thumbnailArray = [];
          //updateData(response.entries)
          console.log(response.entries)
          const respEntry = response.entries;
           for (let key of respEntry) {
            console.log("THUMBNAIL: ")
            console.log(key.thumbnail)
              const thumbnailCode = key.thumbnail
              thumbnailAarray.push(thumbnailCode)
              console.log("THUMBNAILS: ")
              console.log(thumbnailArray) //Håller nu respektive thumbnailkod på varje index

              //Vid useEFfect bör ovan kod köras, både vid första mappen(main) och vid rendering av ny mapp. 
              //thumbnailArray måste skickas in i sitt eget state.
          } 
        }) 
      })
      .catch(function(error) {
        console.log(error);
      });
    }
    
    
  
  return
  }, [props.folder,props.search, searchArr, props.createFolder])


  const readableBytes = (bytes) => {
    const index = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    return (bytes / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + sizes[index];
  }

  const lastEdited = (date) => {
   
    const year = date.substring(0, 4);
    let month = date.substring(5, 7)
    const day = date.substring(8, 10)
    const hour = date.substring(11, 13)
    const minute = date.substring(14, 16)
    const second = date.substring(17, 19)
  

    const months = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    
    month = month.replace(/^0+/, '')
    let monthInText = months[month-1];
    

    return <label>{'Last edited: ' + moment(date).fromNow() + ', ' + day + ' ' + monthInText + ' ' + year}</label>
    
  }

 
  const renderList = (data) => {
    
    const del = (e) => {
      props.path(e.target.dataset.path) 
      props.showModal(true)
    }
    
    if(data[".tag"] === 'file'){ //FILER
      return(
        <tr
            //title={"Download: " + data.name} 
            key={data.id} 
            //className="listFiles" 
            //data-name={data.name} 
            //data-folder={data.path_lower} 
            //data-tag={data[".tag"]}
            >
          <td 
            title={"Download: " + data.name} 
            className="listFiles" 
            data-name={data.name} 
            data-folder={data.path_lower} 
            data-tag={data[".tag"]} onClick={downloadFile}>
              <i className="material-icons-outlined">
                insert_drive_file
              </i>
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
            <button data-path={data.path_lower} onClick={del}> <i className="material-icons">delete_outline</i></button>
          </td>
        </tr>
      )
    }
      return( //FOLDERS
        <tr key={data.id} className="listFiles" to={data.path_lower} data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}>
          <td>
          <i className="material-icons">
            folder
          </i>
          </td>
          <td>
            <Link className="listFolderLink" to={"/main" + data.path_lower}>{data.name}</Link>
          </td>
          <td>
          </td>
          <td>
          </td>
          <td>
            <button data-path={data.path_lower} onClick={del}> <i className="material-icons">delete_outline</i></button>
          </td>
        </tr>
      )
    }
    const replace = () =>{
      window.location.replace("/main")
    }
      
      const listData = data.map(renderList)
      
   let button = "" 
  
   if (searchArr){
    button = <><br/><button className="listBackBtn" onClick={replace}>⟲ Back to files..</button></>
   }
  
  return(
    <>
      {listData}
    </>
  )
}

export default ListItems;