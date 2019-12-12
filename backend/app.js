const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require('./Models/post');

const app = express();

mongoose.connect("mongodb+srv://admin:admin@assignmentdb-zq5i4.mongodb.net/myBookStore?retryWrites=true&w=majority")
.then(() => {
  console.log('Successfully connected to the database!!!');
})
.catch(() => {
  console.log('Connection Failed!!!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.post("/api/books", (req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added',
      postId: createdPost._id
  });
  // console.log(post);
  });
});

app.put("api/books/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description
  });
  Post.updateOne({_id: req.params.id}, post). then(result => {
    console.log(result);
    res.status(200).json({ message: "Update Successfull"});
  })
});

app.get("/api/books", (req, res,next) => {
  Post.find().then(docs => {
    // console.log(docs);
    res.status(200).json({
      message:'Post fetched',
      books: docs
    });
  });
});

app.get("/api/books/:id", (req, res, next) => {
  Book.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    }else{
      res.status(404).json({message: 'Post not found'});
    }
  })
})


app.delete("/api/books/:id", (req, res, next) => {
  // console.log(req.params.id);

  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Post deleted"});
  });
});

module.exports = app;
