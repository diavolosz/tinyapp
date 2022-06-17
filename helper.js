// generateRandomString will allow user to generate 6 digit radomized number of short URL for each long URL submitted
const generateRandomString = () => {
  let array = [];
  for(let x = 0; x < 6; x++) {
    array.push(Math.floor(Math.random() * 9).toString())
  }
  return array.join("")
}

// URLFinder will allow user to scan through the list of submitted and stored URL. Stored URLs are user specific 
const URLFinder = function(urlDatabase, userID) {
  const usersURL = {};
  for (const index of Object.keys(urlDatabase)) {
    if (userID === urlDatabase[index].userID) {
      usersURL[index] = urlDatabase[index];
    }
  }
  return usersURL;
};

// dateMaker will allow user to generate the date of file creation 
const dateMaker = () => {
  let output = new Date().toLocaleDateString()
  return output
}




module.exports = { generateRandomString, URLFinder, dateMaker }; 