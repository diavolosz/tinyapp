const bodyParser = require("body-parser");
const express = require("express")
const app = express()
const PORT = 8080
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // let shortURL = req.params.shortURL
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});

// app.get("/", (req, res) => {
//   res.send("helloooooo")
// })

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});
// app.get("/urls/:shortURL", (req, res) => {
//   const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
//   res.render("urls_show", templateVars);
// });


// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
//  });
 
 app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})





function generateRandomString() {
  let array = [];
  for(let x = 0; x < 6; x++) {
    array.push(Math.floor(Math.random() * 9).toString())
  }
  return array.join("")
}


