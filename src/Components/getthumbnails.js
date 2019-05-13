import chunk from 'lodash.chunk';
import flatten from 'lodash.flatten';

export const getThumbnails = (dbx, entries) => {
  const chunks = chunk(entries, 25);

  const promises = chunks.map((x) => {
    return dbx.filesGetThumbnailBatch({
      entries: x.map(entry => {
        return{
          path: entry.id,
          format : {'.tag': 'jpeg'},
          size: { '.tag': 'w32h32'},
          mode: { '.tag': 'strict' }  
          }
        })
    });
  });

  return Promise.all(promises).then((results) => {
    return flatten(results.map(x => x.entries));
  });
}