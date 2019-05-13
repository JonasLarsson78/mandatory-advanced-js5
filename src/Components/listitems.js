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
import AddFavorites from "./addFavorites.js";
import CopyFiles from './copyfiles.js'





const ListItems = (props) => {

 //===================RENDER LIST====================
  
  const clearSearchFn = () => {
    props.clearSearchUpdate(true)
  }



  const arrIdx = [".jpg", ".jpeg", ".png", ".pdf", ".mp3", ".id3", ".wav", ".mp4", ".mov", 'JPG'] // Array med filer som vissar thumb...

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
              data-tag={data[".tag"]} onClick={downloadFile}
              style={{width: "40px"}}>
                {newThumbs}
            </td>
            <td
              title={"Download: " + data.name} 
              data-name={data.name} 
              data-folder={data.path_lower} 
              data-tag={data[".tag"]} onClick={downloadFile}
            >
            {data.name}
            </td>
            <td style={{width: "80px"}}>
              {readableBytes(data.size)}
            </td>
            <td style={{width: "200px"}}>
              {lastEdited(data.server_modified)}
            </td>
            
            <td style={{width: "43px", textAlign: 'center'}}>
              <RenameFile dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} oldDataUpdate={props.oldDataUpdate} folder={props.folder} path={data.path_lower} pollUpdateMode={props.pollUpdateMode}/>
            </td>
            <td style={{width: "43px", textAlign: 'center'}}>
              <MoveFiles dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} oldDataUpdate={props.oldDataUpdate} folder={props.folder} path={data.path_lower} name={data.name} pollUpdateMode={props.pollUpdateMode}/>
            </td>
            <td style={{width: "45px", textAlign: 'center'}}>
              <CopyFiles data={data} favorites={props.favorites} favUpdate={props.favUpdate} path={data.path_lower} name={data.name} dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} oldDataUpdate={props.oldDataUpdate} pollUpdateMode={props.pollUpdateMode}/>
            </td>
            <td style={{width: "45px", textAlign: 'center'}}>
              <AddFavorites data={data} favorites={props.favorites} favUpdate={props.favUpdate} path={data.path_lower}></AddFavorites>
            </td>
            <td style={{width: "43px", textAlign: 'center'}}>
              <Delete tag={data[".tag"]} name={data.name} dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} oldDataUpdate={props.oldDataUpdate} path={data.path_lower} folder={props.folder} pollUpdateMode={props.pollUpdateMode}/>
            </td>
            
          </tr>
         
        ) 
      }
 
if(data[".tag"] === 'folder'){ //FOLDER

return( //FOLDERS
  <tr key={data.id} className="listFiles" data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}>
    <td style={{width: "40px"}}>
    <i className="material-icons filesFolders">folder</i>
    </td>
    <td>
      <Link className="listFolderLink" to={"/home" + data.path_lower} onClick={clearSearchFn}>{data.name} </Link>
    </td>
    <td style={{width: "80px"}}>
      ...
    </td>
    <td style={{width: "200px"}}>
      ...
    </td>
    
    <td style={{width: "45px", textAlign: 'center'}}>
      <ReNameFolder dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} oldDataUpdate={props.oldDataUpdate} folder={props.folder} path={data.path_lower} pollUpdateMode={props.pollUpdateMode}/>
    </td>
    <td style={{width: "45px", textAlign: 'center'}}>
      <MoveFiles dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} oldDataUpdate={props.oldDataUpdate} folder={props.folder} path={data.path_lower} name={data.name} pollUpdateMode={props.pollUpdateMode}/>
    </td>
    <td style={{width: "45px", textAlign: 'center'}}>
    <CopyFiles data={data} favorites={props.favorites} favUpdate={props.favUpdate} path={data.path_lower} dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} oldDataUpdate={props.oldDataUpdate}
    pollUpdateMode={props.pollUpdateMode}/>
    </td>
    <td style={{width: "45px", textAlign: 'center'}}>
      <AddFavorites data={data} favorites={props.favorites} favUpdate={props.favUpdate} path={data.path_lower}></AddFavorites>
    </td>
    
    <td style={{width: "45px", textAlign: 'center'}}>
      <Delete tag={data[".tag"]} name={data.name} dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} oldDataUpdate={props.oldDataUpdate} path={data.path_lower} folder={props.folder} pollUpdateMode={props.pollUpdateMode}/>
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