export function readableBytes (bytes) {
  if (bytes === 0){
    bytes = 1
  }
  const index = Math.floor(Math.log(bytes) / Math.log(1024)),
  sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + sizes[index];

}