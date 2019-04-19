export const removeItem = (arr, id) => {
  for (let i = 0; i < arr.length; i++) {
    if(arr[i]._id === id){
      arr.splice(i, 1);
      break;
    }
  }
}