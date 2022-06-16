const bodyParser = require("body-parser");
const express = require("express")
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const { generateRandomString, URLFinder, dateMaker } = require('./helper');


const app = express()
const PORT = 8080
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

//--------------------------------------------------------------


const urlDatabase = {};
const users = {};
let usersURLS = {};


//------------------------------------------------------------



app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    let shortURL = generateRandomString()
    let dateMade = dateMaker()
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.user_id,
      date: dateMade
    }
    return res.redirect(`/urls`)
  } else {
    return res.send("<html><body>ERROR 403</body></html>");
  }
});



app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL]
    return res.redirect("/urls")
  }
  return res.send("<html><body>ERROR 403</body></html>");
});



app.post("/urls/:shortURL/submit", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    let dateMade = dateMaker()
    urlDatabase[req.params.shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.user_id,
      date: dateMade
    };
    res.redirect("/urls");
  } else if (req.session.user_id && typeof usersURLS[req.session.user_id] === undefined) {
    return res.send("<html><body>ERROR 403: invalid user urls</body></html>");
  } else {
    return res.send("<html><body>ERROR 403: invalid user </body></html>");
  }
});



app.post("/login", (req, res) => {
  for (const each of Object.keys(users)) {
    if (users[each].email === req.body.email) {
      if (bcrypt.compareSync(req.body.password, users[each].password)) {
        req.session.user_id = each;
        return res.redirect("/urls");
      } else {
        return res.send("<html><body>ERROR 400: Password invalid</body></html>");
      }
    }
  }
  res.send("<html><body>ERROR 400: User does not exit</body></html>");
});



app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect("/login")
});



app.post("/register", (req, res) => {
  const { email, password } = req.body
  let randomId = generateRandomString()

  if (req.body.email === '' || req.body.password === '') {
    return res.send("<html><body>ERROR 400: Email or password is empty</body></html>");
  }
  for (let each in users) {
    if (req.body.email === users[each].email) {
      return res.send("<html><body>ERROR 400: Email already exist</body></html>");
    }
  }
  users[randomId] = {
    id: randomId,
    password: bcrypt.hashSync(password, 10),
    email: email
  }
  req.session.user_id = randomId;
  res.redirect("/urls")
})




//----------------------------------------------------------



app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});



app.get("/urls", (req, res) => {
  if (req.session.user_id) {
    usersURLS = URLFinder(urlDatabase, req.session.user_id);
    let templateVars = {
      urls: usersURLS,
      user: users[req.session.user_id],
    };
    return res.render("urls_index", templateVars);
  } else {
    return res.redirect("/login");
  }
});



app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {
      user: users[req.session.user_id],
    };
    return res.render("urls_new", templateVars);
  } else {
    return res.redirect("/login");
  }
});



app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    const templateVars = {
      user: users[req.session.user_id]
    }
    res.render("urls_registration", templateVars)
  }
})



app.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect('/urls');
  } else {
    const templateVars = {
      user: users[req.session.user_id]
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
  if (!req.session.user_id) {
    return res.send("<html><body>ERROR 403: invalid user </body></html>");
  } else if (req.session.user_id && typeof usersURLS[req.session.user_id] === undefined) {
    return res.send("<html><body>ERROR 403: user not authorized to view </body></html>");
  } else if (!urlDatabase[req.params.shortURL]) {
    return res.send("<html><body>ERROR 403: no url avaliable </body></html>");
  } else {
    const templateVars = { 
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id],
      date: urlDatabase[req.params.shortURL].date,
    }
    res.render("urls_show", templateVars);
  }
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})




//------------------------------------------------------------
