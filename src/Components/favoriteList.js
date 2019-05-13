import React, {useState, useEffect} from 'react';
import {favorites$, updateFavoriteToken} from './store.js';
import {Link} from "react-router-dom";
import {downloadFile} from "./dowload"
import { Dropbox } from 'dropbox';
import {token$} from './store.js';

/*

GOAL: 
When the user clicks on an Add_to_Favorites-button, the chosen file should be copied to a new_state,
with all the needed data.

The new_state should be used to render a favorite_list, which should be displayed in a side_menu on the right of the main_content.

- When the user deletes or renames the file, the file should also be deleted, or renamed, in the favorite_list.
OR ELSE: The demand is that the error caused by the file being used in any way from the favorite_list, after having been deleted, should be handled.
A direct update of the favorite_state is not required, but obviously better.

- When a user logs out, the local storage should be cleaned out, so that no favorites exists once the user logs back in. 

=== Ha state i rooten.
=== Använd behavioursubject för att uppdatera favoritestatet.
=== Kör en toggle onClick - Om id inte finns i listan, lägg till objektet (objekt ska in i state, inte id), om id finns i listan, ta bort.
*/

const FavoriteList = (props) => {
  
/////////////////////////////////////////////////////////////////////////////////////////////////
  const [fav, updateFav] = useState([]);
  
/////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const subscription = favorites$.subscribe(updateFav);
    return () => subscription.unsubscribe();
  }, []);
/////////////////////////////////////////////////////////////////////////////////////////////////
  let sortData = fav.sort((a, b) => (a[".tag"] > b[".tag"]) ? 1 : -1).reverse();
/////////////////////////////////////////////////////////////////////////////////////////////////
useEffect(() => {


  const option = {
    fetch: fetch,
    accessToken: token$.value
  };
  
  const dbx = new Dropbox(
    option,
  );

  setInterval(() => {
    dbx.filesListFolder({
      path: "",
      recursive: true
    
    })
    .then(response => {
      let fav = [...favorites$.value]
      let chekId = response.entries.map(x => x.id)
      let checkIdFav = fav.map(x => x.id)
     

      let z = chekId.filter(function(val) {
        return checkIdFav.indexOf(val) !== -1;
        
      });
      let newFavArr = []
      for (let i = 0; i < z.length; i++){
        let newFav = fav.find( data => data.id === z[i] )
        newFavArr.push(newFav)
      }
      updateFavoriteToken(newFavArr)
            })
  }, 5000);

}, []);


    let data = sortData;
    const renderFavorites = (data) => {
       
      const check = (x) => {
          if (x.id === data.id && x.name !== data.name){
            data = x
          }
        }
      props.data.map(check)
      

        /////IF FILES STARTS////
        if(data[".tag"] === 'file'){ 
              return( //FILES
                <tr
                    key={data.id} 
                    data-name={data.name} 
                    data-folder={data.path_lower} 
                    data-tag={data[".tag"]}
                    style={{background: "white", zIndex: "0"}}
                    className="listFiles"
                    >
                  <td 
                    title={"Download: " + data.name} 
                    data-name={data.name} 
                    data-folder={data.path_lower}
                    data-tag={data[".tag"]} onClick={downloadFile}
                    style={{cursor: "pointer"}}>
                    <i className="material-icons-outlined filesFolders">insert_drive_file</i>
                  </td>
                  <td
                    title={"Download: " + data.name} 
                    data-name={data.name} 
                    data-folder={data.path_lower} 
                    data-tag={data[".tag"]} onClick={downloadFile}
                    style={{cursor: "pointer"}}
                  >
                  {data.name}
                  </td>
                </tr>
              )
        }
        /////IF FILES ENDS////


        const renameBrackets = (rename, newUrl) =>{
          const option = {
            fetch: fetch,
            accessToken: token$.value
          };
          
          const dbx = new Dropbox(
            option,
          );
          dbx.filesMoveV2({
            from_path: rename,
            to_path: newUrl,
            autorename: true
          })
          .then(response => {
            dbx.filesListFolder({
              path: props.folder.substring(5),
            })
            .then(response => {
              props.dataUpdate(response.entries)
            })
            
          })
          .catch(error => {
            console.log(error);
          });
        
        }

      /////IF FOLDER STARTS////
      if(data[".tag"] === 'folder'){ //FOLDER


        if (data.name.includes("(")){

          let brak = data.name.replace(/[()]/g,'')
          let newName = data.path_lower.substring(0, data.path_lower.lastIndexOf("/")) + "/" + brak;
          
          renameBrackets(data.path_lower, newName)
          data.name = brak
        }

      return( //FOLDERS
        
        <tr style={{background: "white"}} key={data.id} className="listFiles" data-name={data.name} data-folder={data.path_lower} data-tag={data[".tag"]}>
          <td>
          <i className="material-icons filesFolders">folder</i>
          </td>
          <td>
            <Link className="listFolderLink" to={"/home" + data.path_lower}>{data.name}</Link>
          </td>
        </tr>
          )
        }
        /////IF FOLDER ENDS//// 
    }

    let renderingFavorites = data.map(renderFavorites);
    
    return (
        <div className="favorite_list" style={{position: "relative", top: "56px", left: "8px"}} >
          <span className="favoriteTitle" style={{fontSize: "14px"}}><i style={{color: "#ffd900", WebkitTextStroke: "1px #4d4d4d", fontSize: "12px"}} className="material-icons">star</i> Favorites:</span>
          <table>
            <tbody>
              {renderingFavorites}
            </tbody>
          </table>
        </div>
    )
}

export default FavoriteList;