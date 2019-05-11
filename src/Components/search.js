import React, {useRef}from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';




const Search = (props) => {
  const inputRef = useRef(null);
 
  
  if(props.clearSearch === true){
    inputRef.current.value = '';
    props.searchUpdateMode(false)

  }
  
 let newFolder = props.folder.substring(5);

 const makeSerch = (e) => {
  
  
  
    const option = {
        fetch: fetch,
        accessToken: token$.value
      };
      const dbx = new Dropbox(
        option,
      );      

      
    if(e.target.value.length < 1){  
      props.searchUpdateMode(false)
      

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
    if(e.target.value.length > 0){
      
      props.searchUpdateMode(true)
      
      dbx.filesSearch({
       
        path: newFolder,
        query: e.target.value,
      })

      .then(response => {
        
        let noResult = [{".tag": 'file', id: 1, noSearchResult: 'noResult'}]
        
        if(response.matches.length === 0){
          props.dataUpdate(noResult)
         

        }
        else{
          props.clearSearchUpdate(false)
          props.thumbnailUpdate([])
         
         
          let newArr = []
          for (let i of response.matches){
            
            newArr.push(i.metadata) 
          }
          props.dataUpdate(newArr) 

        }
       

      })
    }
    
    
    
  }
    
return (
  
    <>
    <i className="material-icons header-serach-icon">search</i>
    <input className="header-search" placeholder="Search..." type="text" onChange={makeSerch} ref={inputRef} />
   
    </>
    )
}

export default Search;

