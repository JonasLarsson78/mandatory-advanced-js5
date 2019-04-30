import {token$} from './store.js';
import { Dropbox } from 'dropbox';

export const downloadFile = (e) => {
    if(e.target.dataset.tag === 'folder'){
      return null;
    }
    
   if(e.target.dataset.tag === 'file'){
     const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    
     const dbx = new Dropbox(option);
     dbx.filesDownload({ 
       path: e.target.dataset.folder})
        .then(response => {
          
         let fileName = response.name
         let blob = response.fileBlob
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
         console.log(error)
        });
    }
  }