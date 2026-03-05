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

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const inputs = document.querySelectorAll("input");
    const arr = Array.from(inputs);
    let index = arr.indexOf(e.target);

    let next = index + 1;

    while (arr[next] && arr[next].disabled) {
      next++;
    }

    if (arr[next]) {
      arr[next].focus();
    }
  }
};

export {removeUnwanted,emptyCount,handleKeyDown}
