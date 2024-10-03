const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.findIndex(u => u.username == username) === -1;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // @cariad
  return users.findIndex(u => u.username == username && u.password == password) > -1;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // @cariad
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(404).json({ message: "Username and password are required" });

  if (!authenticatedUser(username, password))
    return res.status(208).json({ message: "Invalid credentials" });

  let accessToken = jwt.sign(
    { data: password },
    'access',
    { expiresIn: 60 * 60 },
  );

  req.session.authorization = {
    accessToken,
    username,
  }

  return res.status(200).send("Successfully logged in");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // @cariad
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  delete book.reviews[req.session.authorization.username];
  return res.json({ message: "Review deleted" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  book.reviews[req.session.authorization.username] = req.query.review;
  // @cariad
  return res.json({ message: "Review added" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
