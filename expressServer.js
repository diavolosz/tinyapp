const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
const express = require("express")
const app = express()
const PORT = 8080
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

//--------------------------------------------------------------

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

//------------------------------------------------------------




app.post("/urls", (req, res) => {
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});



app.post("/urls/:shortURL/submit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls")
});



app.post("/login", (req, res) => {
  res.cookie('user_id', req.cookies["user_id"])
  res.redirect("/urls")
});


app.post("/logout", (req, res) => {
  res.clearCookie('user_id', req.cookies["user_id"])
  res.redirect("/urls")
});


app.post("/register", (req, res) => {
  const email = req.body.email
  const password = req.body.password
  let randomId = generateRandomString()

  if (req.body.email === '' || req.body.password === '') {
    return res.send("<html><body>ERROR 400</body></html>");
  } else {
    let eachUser = Object.keys(users)
    for (const id of eachUser) {
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
  res.redirect("/urls")
})




//----------------------------------------------------------

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});



app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});



app.get("/register", (req, res) => {
  const templateVars = {
    // user: req.cookies["user_id"],
    user: users[req.cookies.user_id]

  }
  res.render("urls_registration", templateVars)
})



app.get("/login", (req, res) => {
  const templateVars = {
    // user: users[req.cookies.user_id]
    user: users[req.cookies.user_id]

  }
  res.render("urls_login", templateVars)
})



app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});



app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    // user: req.cookies["user_id"],
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


