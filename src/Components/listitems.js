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




const ListItems = (props) => {
  
 //===================RENDER LIST====================
  const arrIdx = [".txt"] // Array med filer som thumb. inte funkar.

  const renderList = (data, index) => {
    
   const thumbs = props.thumbnailsLoaded ? props.thumbnails[index] : undefined;

    if(data[".tag"] === 'file'){ //FILER
     
      let newThumbs = thumbs === undefined ? <i className="material-icons-outlined filesFolders">insert_drive_file</i> : <img src={"data:image/jpeg;base64," + thumbs.thumbnail} alt=""/>
      
      let idx = data.name.lastIndexOf('.');
      let newIdx = data.name.substring(idx);

      if (arrIdx.includes(newIdx)){
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
              data-tag={data[".tag"]} onClick={downloadFile}>
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
            <td>
              {readableBytes(data.size)}
            </td>
            <td>
              {lastEdited(data.server_modified)}
            </td>
            <td>
              <Delete dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} path={data.path_lower} folder={props.folder}/>
            </td>
            <td>
              <RenameFile dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} folder={props.folder} path={data.path_lower}/>
            </td>
            <td>
              <MoveFiles dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} folder={props.folder} path={data.path_lower}/>
          </td>
          </tr>
        ) 
      }
  

if(data[".tag"] === 'folder'){ //FOLDER
return( //FOLDERS
  <tr key={data.id} className="listFiles" data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}>
    <td>
    <i className="material-icons filesFolders">folder</i>
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
      <Delete dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} path={data.path_lower} folder={props.folder}/>
    </td>
    <td>
      <ReNameFolder dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} folder={props.folder} path={data.path_lower}/>
    </td>
    <td>
      <MoveFiles dataUpdate={props.dataUpdate} thumbnailUpdate={props.thumbnailUpdate} folder={props.folder} path={data.path_lower}/>
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