const dateMaker = () => {
  let output = new Date().toLocaleDateString()
  // .split(" ").splice(0, 4).join(" ")
  return output
}

console.log(dateMaker())