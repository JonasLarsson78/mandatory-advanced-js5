import React, {useState, useEffect} from 'react';
import {token$} from './store.js';
import { Dropbox } from 'dropbox';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import '../Css/listitems.css';


const ListItems = (props) => {
  const [data, updateData] = useState([])

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
       
        
        
      })
      .catch(function(error) {
        console.log(error);
      });
    }
    
  
  return
  }, [props.folder])

  
  
  const downloadFile = (e) => {
    if(e.target.dataset.tag === 'folder'){
      return null;
    }
    
   if(e.target.dataset.tag === 'file'){

     const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    console.log(props)
     const dbx = new Dropbox(option);
     dbx.filesDownload({ 
       path: e.target.dataset.folder})
        .then(response => {
          
         let fileName = response.name
         let blob = response.fileBlob
         
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          document.body.append(link);
          link.click();
          link.remove();
          window.addEventListener('focus', (e) => URL.revokeObjectURL(link.href));
        })
        .catch(error => {
         console.log(error)
        });
    }
  }
  
 
  const renderList = (data) => {


    if(data[".tag"] === 'file'){

      return(
        <li key={data.id} className="listFiles" to={data.path_lower} data-name={data.name} onClick={downloadFile} data-folder={data.path_lower} data-tag={data[".tag"]}>{data.name}</li>
      )
      
    }

    return(
      
      <li key={data.id} className="listFiles" to={data.path_lower} data-name={data.name} onClick={downloadFile} data-folder={data.path_lower} data-tag={data[".tag"]}><Link to={"/main" + data.path_lower}>{data.name}</Link></li>
      
      )
  }

  const listData = data.map(renderList)
  
  return(
    <>
      {listData}
    </>
  )
}

export default ListItems;

{/* <li><Link to={data.path_lower} onClick={navigate} key={data.id} data-folder={data.path_lower} data-tag={data[".tag"]}>{data.name}</Link></li> */}