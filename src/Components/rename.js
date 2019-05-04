import { Dropbox } from 'dropbox';
import {token$} from './store.js';

export const renameFile = (name, newName) => {

    const option = {
        fetch: fetch,
        accessToken: token$.value
      };

      const dbx = new Dropbox(
        option,
      );

      dbx.filesMoveV2({
        from_path: name,
        to_path: newName,
        autorename: true
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error);
      });


}