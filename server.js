var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = "spacebookDB";

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/spacebookDB', function () {
    console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// You will need to create 5 server routes
// These will define your API:

//route to get all posts in order to present them in view
app.get("/posts", function (req, res) {
    
    Post.find().exec(function(err, post) {
        if (err) {
            // Note that this error doesn't mean nothing was found,
            // it means the database had an error while searching, hence the 500 status
            res.status(500).send(err)
        } else {
            // send the list of all people
            res.status(200).send(post);
            
        }
    });
});

//route to add a post
app.post('/posts', function(req, res){
    
    var postObj = new Post({
        text: req.body.text
    });
    postObj.save(function (err, post) {
        if (err) { 
            console.log(err);
        }
        res.json(201, post);
      });    
});

//route to delete post
app.delete("/delete/:id", function (req, res) {

    Post.findOneAndRemove({_id : new mongoose.mongo.ObjectID(req.params.id)}, function (err,post){
        if (err)
        res.send(err);
    else
        //want to see the deleted post back from server
        res.json(201, post);
      });
      
});
  
//route to add comment to a post
app.post("/posts/:id", function (req, res) {
   
    Post.findOneAndUpdate({_id : new mongoose.mongo.ObjectID(req.params.id)}, {$push:{comments: req.body}}, {new: true}, function(err, doc){
        if(err){
            res.send(err);
        }    
        res.json(201, doc);
    });
});
     

// 5) to handle deleting a comment from a post

app.listen(8000, function () {
    console.log("what do you want from me! get me on 8000 ;-)");
});
