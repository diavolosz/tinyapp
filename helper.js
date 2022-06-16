
function generateRandomString() {
  let array = [];
  for(let x = 0; x < 6; x++) {
    array.push(Math.floor(Math.random() * 9).toString())
  }
  return array.join("")
}

const URLFinder = function(urlDatabase, userID) {
  const usersURL = {};
  for (const index of Object.keys(urlDatabase)) {
    if (userID === urlDatabase[index].userID) {
      usersURL[index] = urlDatabase[index];
    }
  }
  return usersURL;
};


let dateMaker = () => {
  let output = Date().split(" ").splice(0, 4).join(" ")
  return output
}


module.exports = { generateRandomString, URLFinder, dateMaker }; 