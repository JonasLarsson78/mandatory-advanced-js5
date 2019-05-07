import React, {useState} from 'react';
import {token$} from './store.js';
import { Dropbox } from 'dropbox';

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

const AddFavorites = (props) => {
    const [favorites, updateFavorites] = useState([]);
//////////////////////////////////////////////////////////////////////////////////////////////////
    const add = (e) => {
        let newArray = [...favorites, e.target.dataset.id]
        updateFavorites(newArray)
    }
    console.log(favorites)
/////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <button className="listBtn" data-path={props.path} data-id={props.id} onClick={add}><i className="material-icons" data-path={props.path} data-id={props.id}>grade_outline</i></button>
    )
}

export default AddFavorites;