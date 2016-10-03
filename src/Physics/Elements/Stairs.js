import SideJump from "./SideJump.js";

function generator(args){
  let top = args[0];
  let height = args[1];
  let size = args[2];
  let elements = [];
  for(let i = 0; i<height/size; i++){
    let x = top-((0.5 + i)*size);
    let y = height - (0.5+i)*size;
    elements.push(new SideJump(x, y, size, size));
  }
  return elements;
}

export default generator;
