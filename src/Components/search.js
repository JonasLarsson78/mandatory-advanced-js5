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
      dbx.filesSearch({
       
        path: newFolder,
        query: e.target.value,
      })
      .then(response => {

        if (response.matches.length === 0){
            props.updateSearch(null)
        }
        else{
          props.search(response.matches)
        }
      })
      .catch(function(error) {
        if (error.response.status === 400){
          console.log("Wrong input.")
        }
        if (error.response.status === 409){
          console.log("Wrong search path.")
        }
           
      });
 }

return (
    <>
    <i className="material-icons header-serach-icon">search</i>
    <input className="header-search" placeholder="Search..." type="text" onChange={makeSerch} />
    </>
    )
}

export default Search;