import React, {useRef, useEffect}from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import { getThumbnails } from './getthumbnails'
import { errorFunction } from './error.js'



const Search = (props) => {
  const inputRef = useRef(null);
  
  const { clearSearch, pollUpdateMode } = props;

  useEffect(() => {
    if(clearSearch === true){
      inputRef.current.value = '';
      pollUpdateMode(false)
    }
  }, [clearSearch, pollUpdateMode])

  

  
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
                        console.log('Search Thumbnail 52');
                        errorFunction(error, props.updateErrorMessage)
                      });
            })
            .catch(function(error) {
              console.log('Search FilesListFolder 57');
              errorFunction(error, props.updateErrorMessage)
            });
            props.updateErrorMessage('')
    }
    if(e.target.value.length > 0){
     //props.clearSearchUpdate(false)
      props.pollUpdateMode(true)
      
      dbx.filesSearch({
        path: newFolder,
        query: e.target.value,
      })

      .then(response => {
        let noResult = [{".tag": 'file', id: 1, noSearchResult: 'noResult'}]
        if (response.matches.length === 0){
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
    props.updateErrorMessage('')
  }
    
return (
  
    <>
    <i className="material-icons header-serach-icon">search</i>
    <input className="header-search" placeholder="Search..." type="text" onChange={makeSerch} ref={inputRef} />
   
    </>
    )
}

export default Search;

