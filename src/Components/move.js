import { Dropbox } from 'dropbox';
import {token$} from './store.js';

export const move = () => {

    const option = {
        fetch: fetch,
        accessToken: token$.value
      };

      const dbx = new Dropbox(
        option,
      );

      dbx.filesListRevisions({
        path: "",
        mode: ""
        
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error);
      });


}