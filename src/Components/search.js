import React, {useRef}from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import { getThumbnails } from './getthumbnails'



const Search = (props) => {
  const inputRef = useRef(null);
 
  
  if(props.clearSearch === true){
    inputRef.current.value = '';
    props.pollUpdateMode(false)

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
      props.pollUpdateMode(false)
      

      dbx.filesListFolder({
        path: props.folder.substring(5),
      
            }).then(response =>{
              props.thumbnailUpdate([])
              props.dataUpdate(response.entries)
              props.oldDataUpdate(response.entries)
  
              getThumbnails(dbx, response.entries)

                    .then(entries => {   

                      props.thumbnailUpdate(entries)
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
      
      props.pollUpdateMode(true)
      
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

