const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
const express = require("express")
const app = express()
const PORT = 8080
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

//--------------------------------------------------------------

const urlDatabaseOld = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
    },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


const usersURL = {}


//------------------------------------------------------------




app.post("/urls", (req, res) => {
  if (req.cookies.user_id) {
    let shortURL = generateRandomString()
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.cookies.user_id
    }
    return res.redirect(`/urls/${shortURL}`)
  } else {
    return res.send("<html><body>ERROR 403</body></html>\n");
  }
});



app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.cookies.user_id) {
    delete urlDatabase[req.params.shortURL]
    return res.redirect("/urls")
  }
  return res.send("<html><body>ERROR 403</body></html>\n");
});



app.post("/urls/:shortURL/submit", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.cookies.user_id) {
    urlDatabase[req.params.shortURL] = {
      longURL: req.body.longURL,
      userID: req.cookies.user_id
    };
    return res.redirect("/urls");
  } else {
    return res.send("<html><body>ERROR 403</body></html>\n");
  }
});



app.post("/login", (req, res) => {
  const email = req.body.email
  const password = req.body.password
  for (let index in users) {
    if (email === users[index].email && password === users[index].password) {
      res.cookie('user_id', index)
      return res.redirect("/urls")
    }
  }
  res.send("<html><body>ERROR 403</body></html>");
});


app.post("/logout", (req, res) => {
  res.clearCookie('user_id', req.cookies["user_id"])
  res.redirect("/login")
});


app.post("/register", (req, res) => {
  const email = req.body.email
  const password = req.body.password
  let randomId = generateRandomString()

  if (req.body.email === '' || req.body.password === '') {
    return res.send("<html><body>ERROR 400</body></html>");
  } else {
    let eachUser = Object.keys(users)
    for (let id of eachUser) {
      if (req.body.email === users[id].email) {
        return res.send("<html><body>ERROR 400</body></html>");
      }
    }
  }
  users[randomId] = {
    id: randomId,
    password: password,
    email: email
  }
  res.cookie('user_id', randomId)
  console.log(users)
  res.redirect("/urls")
})




//----------------------------------------------------------

app.get("/", (req, res) => {
  if (req.cookies.user_id) {
    return res.redirect('/urls');
  } else {
    return res.redirect('/login');
  }
});


app.get("/urls", (req, res) => {
  if (req.cookies.user_id) {
    usersURLS = URLFinder(urlDatabase, req.cookies.user_id);
    let templateVars = {
      urls: usersURLS,
      user: users[req.cookies.user_id]
    };
    return res.render("urls_index", templateVars);
  } else {
    return res.redirect("/login");
  }
});



app.get("/urls/new", (req, res) => {
  if (req.cookies.user_id) {
    let templateVars = {
      user: users[req.cookies.user_id],
    };
    return res.render("urls_new", templateVars);
  } else {
    return res.redirect("/login");
  }
});



app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  }
  res.render("urls_registration", templateVars)
})



app.get("/login", (req, res) => {
  if (req.cookies.user_id) {
    return res.redirect('/urls');
  } else {
    const templateVars = {
      user: users[req.cookies.user_id]
    }
    return res.render("urls_login", templateVars)
  }
})



app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.send("<html><body>URL doesn't exist</body></html>")
  }
  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});



app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies.user_id]

  };
  res.render("urls_show", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})




//------------------------------------------------------------
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


