import { Dropbox } from 'dropbox';
import {token$} from './store.js';


export const deleteFiles = (filePath) => {

    const option = {
        fetch: fetch,
        accessToken: token$.value
      };

      const dbx = new Dropbox(
        option,
      );

      dbx.filesDeleteV2({
        path: filePath,
      })
      .then(response => {
        /* Hitta en annan lösning */
        let url = filePath.substring(0, filePath.lastIndexOf("/"));
        window.location.replace("/main" + url)
      })
      .catch(function(error) {
        console.log(error);
      });

}