import React, {useState, useEffect} from 'react';
import {token$} from './store.js';
import { Dropbox } from 'dropbox';

const ListItems = (props) => {

  const [data, updateData] = useState(props.listData)


  const navigate = (e) => {

   console.log(e.target.dataset.folder)
    //updateFolder(e.target.dataset.folder)

    const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    
    const dbx = new Dropbox(
      option,
    );
    dbx.filesListFolder({
      path: e.target.dataset.folder
    })
    .then(response => {
      console.log(response)
      updateData(response.entries)
      
      
    })
    .catch(function(error) {
      console.log(error);
    });


  }

  const renderList = (data) => {
    return(
      <li onClick={navigate} key={data.id} data-folder={data.path_lower}>{data.name}</li>
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