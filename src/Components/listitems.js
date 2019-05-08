import React from 'react';
import {Link}from "react-router-dom";
import '../Css/listitems.css';
import {readableBytes} from './readablebytes'
import {lastEdited} from './lastedited'
import { downloadFile } from './dowload'
import { Helmet } from "react-helmet";
import Delete from './delete'
import RenameFile  from './renameFiles'
import ReNameFolder from './renameFolder.js';
import MoveFiles from './movefiles.js'
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import AddFavorites from "./addFavorites.js";



const ListItems = (props) => {
  
 //===================RENDER LIST====================

  const arrIdx = [
    ".jpg",
    ".jpeg",
    ".png",
    ".pdf",
    ".wav",
    ".mp3",
    ".id3",
    ".mp4",
    ".mov",
  ] // Array med filer som vissar thumb...

  const renderList = (data, index) => {

    if(data.noSearchResult){
      return(
        
          <tr key={data.id}>
            <td>No search matches</td>
          </tr>
        
      )
    }

   const thumbs = props.thumbnailsLoaded ? props.thumbnails[index] : undefined;

    if(data[".tag"] === 'file'){ //FILER
     
      let newThumbs = thumbs === undefined ? <i className="material-icons-outlined filesFolders">insert_drive_file</i> : <img src={"data:image/jpeg;base64," + thumbs.thumbnail} alt=""/>
      
      let idx = data.name.lastIndexOf('.');
      let newIdx = data.name.substring(idx);
      /*------------- Audio idx files -----------------------------------*/
      let audioIdx = [".wav", ".mp3", ".id3"]
      if (audioIdx.includes(newIdx)){
        newThumbs = <i className="material-icons filesFolders">audiotrack</i>
      }
      /* --------------------------------------------------------------- */

       /*------------- Vidio idx files -----------------------------------*/
      let videoIdx = [".mov", ".mp4"]
      if (videoIdx.includes(newIdx)){
        newThumbs = <i className="material-icons filesFolders">local_movies</i>
      }
      /* --------------------------------------------------------------- */

      if (!arrIdx.includes(newIdx)){
        newThumbs = <i className="material-icons-outlined filesFolders">insert_drive_file</i>
      }

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
              data-tag={data[".tag"]}
              onClick={downloadFile}
              style={{width: "40px"}}>
                {newThumbs}
            </td>
            <td
              title={"Download: " + data.name} 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]}
              onClick={downloadFile}
              >
            {data.name}
            </td>
            <td style={{width: "100px"}}>
              {readableBytes(data.size)}
            </td>
            <td style={{width: "300px"}}>
              {lastEdited(data.server_modified)}
            </td>
            <td style={{width: "30px"}}>
              <Delete tag={data[".tag"]} name={data.name} dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} path={data.path_lower} folder={props.folder}/>
            </td>
            <td style={{width: "30px"}}>
              <RenameFile dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} folder={props.folder} path={data.path_lower}/>
            </td>
            <td style={{width: "30px"}}>
              <MoveFiles dataUpdate={props.dataUpdate} folder={props.folder} path={data.path_lower} name={data.name}/>
            </td>
            <td style={{width: "30px"}}>
              <AddFavorites data={data} favorites={props.favorites} favUpdate={props.favUpdate} id={data.id} path={data.path_lower} ></AddFavorites>
            </td>
          </tr>
         
        ) 
      }
  const renameBrackets = (rename, newUrl) =>{
    const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    
    const dbx = new Dropbox(
      option,
    );
    dbx.filesMoveV2({
      from_path: rename,
      to_path: newUrl,
      autorename: true
    })
    .then(response => {
      dbx.filesListFolder({
        path: props.folder.substring(5),
      })
      .then(response => {
        props.dataUpdate(response.entries)
      })
      
    })
    .catch(error => {
      console.log(error);
    });
  
  }

if(data[".tag"] === 'folder'){ //FOLDER

  if (data.name.includes("(")){

    let brak = data.name.replace(/[()]/g,'')
    let newName = data.path_lower.substring(0, data.path_lower.lastIndexOf("/")) + "/" + brak;
    
    renameBrackets(data.path_lower, newName)
    data.name = brak
  }
return( //FOLDERS
  <tr key={data.id} className="listFiles" data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}>
    <td style={{width: "40px"}}>
    <i className="material-icons filesFolders">folder</i>
    </td>
    <td>
      <Link className="listFolderLink" to={"/home" + data.path_lower}>{data.name}</Link>
    </td>
    <td style={{width: "100px"}}>
      ...
    </td>
    <td style={{width: "250px"}}>
      ...
    </td>
    <td style={{width: "30px"}}>
      <Delete tag={data[".tag"]} name={data.name} dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} path={data.path_lower} folder={props.folder}/>
    </td>
    <td style={{width: "30px"}}>
      <ReNameFolder dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} folder={props.folder} path={data.path_lower}/>
    </td>
    <td style={{width: "30px"}}>
      <MoveFiles dataUpdate={props.dataUpdate} folder={props.folder} path={data.path_lower} name={data.name}/>
    </td>
    <td style={{width: "30px"}}>
        <AddFavorites data={data} favorites={props.favorites} favUpdate={props.favUpdate} path={data.path_lower}></AddFavorites>
    </td>
  </tr>
    )
  } 
}
    
  const listData = props.renderData.map(renderList)
     
  return(
    <>
    <Helmet>
      <title>MyBOX</title>
    </Helmet>
      {listData}
    </>
  )
}

export default ListItems;