//return lowercase no spaces , no special characters
const  removeUnwanted =(data)=> {
  const removeWhites = data.replace(/\s+/g, "_").toLowerCase();
  const removeSpecialCharacters = removeWhites.replace(/[.~!@#$%^&*()/]/g, "_");
  return removeSpecialCharacters;
}

const emptyCount =(data)=>{
    let currentEmpty = 0;
    Object.entries(data).map(([key,value])=>{
        if(value === ''){
            currentEmpty += 1
        }
    })

    return currentEmpty;
}

export {removeUnwanted,emptyCount}
