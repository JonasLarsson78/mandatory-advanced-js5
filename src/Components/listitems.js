import React, {useState, useEffect} from 'react';
import {token$} from './store.js';
import { Dropbox } from 'dropbox';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import '../Css/listitems.css';
import { downloadFile } from './dowload'


const ListItems = (props) => {
  
  const [data, updateData] = useState([])
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
        console.log(response)

       


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
          console.log(response)
          //updateData(response.entries)
          
          
        }) 





      })
      .catch(function(error) {
        console.log(error);
      });





    }
    
    
    
  
  return
  }, [props.folder,props.search, searchArr])
 
  const renderList = (data) => {
    console.log(data)

    if(data[".tag"] === 'file'){

      return(
        <li title={"Download: " + data.name} key={data.id} className="listFiles" to={data.path_lower} data-name={data.name} onClick={downloadFile} data-folder={data.path_lower} data-tag={data[".tag"]}>{data.name}</li>
      )
    }
      return(
        <li key={data.id} className="listFiles" to={data.path_lower} data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}><Link className="listFolderLink" to={"/main" + data.path_lower}>{data.name}</Link></li>
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