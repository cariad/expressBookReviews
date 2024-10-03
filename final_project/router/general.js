const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // @cariad
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(404).json({ message: "Username and password are required" });

  if (!isValid(username))
    return res.status(404).json({ message: "User already exists" });

  users.push({ username, password });
  return res.status(200).json({ message: "Successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.set("Content-Type", "text/plain");
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.send(book);
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const booksByAuthor = [];

  for (isbn in books) {
    const book = books[isbn];

    if (book.author === req.params.author)
      booksByAuthor.push(book);
  }

  return res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const booksByTitle = [];

  for (isbn in books) {
    const book = books[isbn];

    // @cariad
    if (book.title === req.params.title)
      booksByTitle.push(book);
  }

  return res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.send(book.reviews);
});

module.exports.general = public_users;
