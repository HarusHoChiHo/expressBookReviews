const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const secretKey = '123456789wwwww'; 
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.find(user => user.username == username) == undefined;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.find(user => user.username == username && user.password == password) == undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  const token = req.session.jwt;
  if(token){
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          res.send('Invalid token');
        } else {
          // Token is valid, send welcome message with username
          res.send(`Welcome ${decoded.username}`);
        }
      });
    }

  if (authenticatedUser(username, password)) {
    req.session.user = username;
    req.session.jwt = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.send('Logged in successfully');
  } else {
    res.send('Invalid username / password');
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // Token is valid, send welcome message with username
  let isbn = req.params.isbn;
  let book = books[isbn];
  let username = req.session.user;
  book.reviews[username] = req.body.reviews;
  books[isbn] = book;
  return res.send(books[isbn]);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // Token is valid, send welcome message with username
  let isbn = req.params.isbn;
  let book = books[isbn];
  let username = req.session.user;
  delete book.reviews[username];
  books[isbn] = book;
  return res.send(books[isbn]);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
