import React, {useState, useEffect} from 'react';
import {token$, favorites$, updateFavoriteToken} from './store.js';
import { Dropbox } from 'dropbox';
import {Link} from "react-router-dom";
import {downloadFile} from "./dowload"

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

const FavoriteList = () => {
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
    let data = sortData;
    const renderFavorites = (data, index) => {
        /////IF FILES STARTS////
        if(data[".tag"] === 'file'){ 
              return( //FILES
                <tr
                    key={data.id} 
                    data-name={data.name} 
                    data-folder={data.path_lower} 
                    data-tag={data[".tag"]}
                    style={{background: "white"}}
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
      /////IF FOLDER STARTS////
      if(data[".tag"] === 'folder'){ //FOLDER
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
        <div className="favorite_list">
          
          <table className="favTable">
            <thead>
              <th colSpan="2"><p className="favoriteTitle" style={{fontWeight: "bold"}}><i style={{color: "#ffd900", WebkitTextStroke: "1px #4d4d4d", fontSize: "12px"}} className="material-icons">star</i> Favorites</p></th>
            </thead>
            <tbody>
              {renderingFavorites}
            </tbody>
          </table>
        </div>
    )
}

export default FavoriteList;