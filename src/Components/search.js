import React from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';

const Search = (props) => {

 let newFolder = props.folder.substring(5);

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
        console.log(response)
        if (response.matches.length === 0){
          dbx.filesListFolder({
            path: props.folder.substring(5),
          
                }).then(response =>{
                  
                  props.dataUpdate(response.entries)
      
                        dbx.filesGetThumbnailBatch({
                          entries: response.entries.map(entry => {
                          return{
                            path: entry.id,
                            format : {'.tag': 'jpeg'},
                            size: { '.tag': 'w32h32'},
                            mode: { '.tag': 'strict' }  
                            }
                          }) 
                        }) 
                        .then(response => {   
                          
                          props.thumbnailUpdate(response.entries)
                          })
                          .catch(function(error) {
                            console.log(error);
                          });
                  
                })
                .catch(function(error) {
                  console.log(error);
                });
        }
        else{
          
           props.thumbnailUpdate([])
         
         
          let newArr = []
          for (let i of response.matches){
            
            newArr.push(i.metadata) 
          }
          props.dataUpdate(newArr) 
          
          
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