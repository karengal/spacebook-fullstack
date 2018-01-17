var mongoose = require('mongoose');
var schema = mongoose.schema;
  
var commentSchema = new mongoose.Schema({
    text: String,
    user: String    

});

//each data field in array is a ref to a comment entity
var postSchema = new mongoose.Schema({
    text: String,
    //this is in order to turn db to having population
    //comments: [{type: Schema.Types.ObjectId, ref: 'comment'}]
    comments: [commentSchema]

});

var Post = mongoose.model('post', postSchema);
var Comment = mongoose.model('comment', commentSchema);

//hard coded to check
// Post.create({
//   text: "test first post",
//   comments: [{text: "test com 1",user: "Karen"},{text: "test com 2", user: "Karen"}]
// },
//  function(err, data) {
//   if (err) {
//     return console.error(err)
//   }
//   console.log(data)
// })

// Post.create({
//     text: "test second post",
//     comments: [{text: "test com 3",user: "Jasson"},{text: "test com 4", user: "Jasson"}]
//   },
//    function(err, data) {
//     if (err) {
//       return console.error(err)
//     }
//     console.log(data)
//   })
  
module.exports = Post
//module.exports = Comment