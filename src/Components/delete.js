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
        let path = window.location.pathname
        setTimeout(startTimer, 700);
    function startTimer() {
      window.location.replace(path)
    }
   clearTimeout(startTimer)
      })
      .catch(function(error) {
        console.log(error);
      });

}