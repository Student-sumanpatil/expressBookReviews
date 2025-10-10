const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// 📘 Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username & password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  let existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists!" });
  }

  // Register new user
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// 📗 Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// 📙 Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Get author name from request
    const bookKeys = Object.keys(books); // Get all ISBN keys
  
    let booksByAuthor = [];
  
    // Loop through all books and find matches by author name
    bookKeys.forEach((isbn) => {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor.push(books[isbn]);
      }
    });
  
    // Check if any books found
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found for author: " + author });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Get title from request
    const bookKeys = Object.keys(books); // Get all ISBN keys
  
    let booksByTitle = [];
  
    // Loop through all books and find matches by title
    bookKeys.forEach((isbn) => {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        booksByTitle.push(books[isbn]);
      }
    });
  
    // Check if any books found
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({ message: "No books found with title: " + title });
    }
  });
  

// 📝 Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
