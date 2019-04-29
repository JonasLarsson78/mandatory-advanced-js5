import React from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';

const Search = (props) => {

 let newFolder = props.folder
 newFolder = newFolder.substring(5);

 const makeSerch = (e) => {

    const option = {
        fetch: fetch,
        accessToken: token$.value
      };
      const dbx = new Dropbox(
        option,
      );
      console.log(newFolder)
      dbx.filesSearch({
        path: newFolder,
        query: e.target.value,
      })
      .then(response => {
        console.log(response.matches)
        props.search(response.matches)
      })
      .catch(function(error) {
        console.log(error);
      });
 }
return <input type="text" onChange={makeSerch} />
}

export default Search;