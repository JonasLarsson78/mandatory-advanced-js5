import React, {useState, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";




const Search = (props) => {
 const [input, updateInput] = useState("");

 let newFolder = props.folder
 newFolder = newFolder.substring(5);

 const makeSerch = (e) => {

  updateInput(e.target.value)

    const option = {
        fetch: fetch,
        accessToken: token$.value
      };
      const dbx = new Dropbox(
        option,
      );
      dbx.filesSearch({
        path: newFolder,
        query: input,
      })
      .then(response => {
        props.search(response.matches)
   
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
    <input type="text" onChange={makeSerch} />
    
    </>
    )
}

export default Search;