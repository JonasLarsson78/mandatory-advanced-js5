import {token$} from './store.js';
import { Dropbox } from 'dropbox';

export const downloadFile = (e, updateErrorMessage) => {
    if(e.target.dataset.tag === 'folder'){
      return null;
    }
    
   if(e.target.dataset.tag === 'file'){
     const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    
     const dbx = new Dropbox(option);
     dbx.filesGetTemporaryLink({ 
       path: e.target.dataset.folder})
        .then(response => {
          let link = document.createElement("a");
          link.href = response.link;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          if (error.response.status > 399 && error.response.status < 500 ) {
            updateErrorMessage('Something went wrong, please try again');
          }
          else if (error.response.status > 499 && error.response.status < 600 ) {
            updateErrorMessage('Something went wrong with the server, please try again');
          }
          else {
            updateErrorMessage('Something went wrong, please try again');
          }
        });
    }
  }