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

        console.log(response.matches.length)
        if (response.matches.length === 0){

            props.updateSearch(null)
            
          
        }
        else{
          props.search(response.matches)
        }
        
      })
      .catch(function(error) {
        console.log(error);
      });
 }
 const onChange = (e) => {
  updateInput(e.target.value)
 }

return (
    <>
    <input className="header-search" placeholder="Search..." type="text" onChange={makeSerch} />
    
    </>
    )
}

export default Search;