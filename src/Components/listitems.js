import React, {useState, useEffect} from 'react';
import {token$} from './store.js';
import { Dropbox } from 'dropbox';
import { BrowserRouter as Router, Route, Link}from "react-router-dom";
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

    if(data.length === 0){

      dbx.filesListFolder({
        path: ''
      })
      .then(response => {
        console.log(response.entries)
        updateData(response.entries)
        console.log(data)
       
      })
      .catch(function(error) {
        console.log(error);
      });

    }
    
    
  }, [])

  
  
  const downloadFile = (e) => {

    if(e.target.dataset.tag === 'folder'){
      return null;
    }
    
   console.log(e.target.dataset.folder)
   console.log(e.target.dataset.tag)

   if(e.target.dataset.tag === 'file'){
     console.log('detta är en fil')

     const option = {
      fetch: fetch,
      accessToken: token$.value
    };

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
          window.addEventListener('focus', e => URL.revokeObjectURL(link.href), {once:true});

        })
        .catch(error => {
         console.log(error)
             });

     return;
   }
    //updateFolder(e.target.dataset.folder


  }
 
  const renderList = (data) => {
    return(
      <Link to={'/main' + data.path_lower}><li className="listFiles" data-name={data.name} onClick={downloadFile} key={data.id} data-folder={data.path_lower} data-tag={data[".tag"]}>{data.name}</li></Link>
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