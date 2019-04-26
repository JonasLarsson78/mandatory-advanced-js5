import React, {useState, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';



const Search = (props) => {
 const [input, updateInput] = useState("");

 const makeSerch = () => {
    const option = {
        fetch: fetch,
        accessToken: token$.value
      };
      
      const dbx = new Dropbox(
        option,
      );
      dbx.filesSearch({
        path: "",
        query: input
      })
      .then(response => {
        console.log(response)
        props.search(response.matches)
        
      })
      .catch(function(error) {
        console.log(error);
      });
 }
 
const onChange = (e) =>{
    updateInput(e.target.value)
}

   

return (
    <>
    <input type="text" onChange={onChange} />
    <button onClick={makeSerch}>Search</button>
    </>

);


}
export default Search;