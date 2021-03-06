var SpacebookApp = function () {

    var posts = [];    

    var $posts = $(".posts");

    var fetch = function () {

        var strUrl = "/posts";

        $.ajax({

            method: "GET",
            url: strUrl,
            success: function (data) {

                posts = data;
                console.log("posts from fetch" + posts);
                _renderPosts();

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    //data should be fetched when page loads in first place
    fetch();

    _renderPosts();

    function _renderPosts() {
        $posts.empty();
        var source = $('#post-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < posts.length; i++) {
            var newHTML = template(posts[i]);
            //console.log(newHTML);
            $posts.append(newHTML);
            _renderComments(i)
        }
    }

    function addPost(newPostText) {
        //adding a post from user
        $.ajax({
            method: "POST",
            url: "/posts",
            data: { text: newPostText },
            success: function (data) {

                console.log(data);
                posts.push(data);
                console.log("posts: " + posts);
                _renderPosts();
            },
            error: function (error) {

            }
        });

    }


    function _renderComments(postIndex) {
        var post = $(".post")[postIndex];
        $commentsList = $(post).find('.comments-list')
        $commentsList.empty();
        var source = $('#comment-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < posts[postIndex].comments.length; i++) {
            var newHTML = template(posts[postIndex].comments[i]);
            $commentsList.append(newHTML);
        }
    }

    var removePost = function (index) {
        //find the post in db and remove it
        //after recieveing server response remove from array and render view   

        var postId = posts[index]._id;
        console.log(postId);

        $.ajax({

            type: "DELETE",
            url: "/delete/" + postId,
            success: function (data) {
                // console.log(postId);
                console.log(data);
                posts.splice(index, 1);
                fetch();
                _renderPosts();

            },
            error: function (error) {

            }
        });


    };
   
    var addComment = function (newCommentObj, postIndex) {
        
        //pass the server post id to which to add a comment  
        var postId = posts[postIndex]._id;
        console.log(postId);

        $.ajax({

            type: "POST",
            url: "/posts/" + postId,
            data: newCommentObj,
            success: function (data) {                
              //when data is ssuccessfully back from server push it to posts array 
                console.log(data.comments);
                posts[postIndex].comments = (data.comments);
                console.log(posts[postIndex]);
                _renderComments(postIndex);                

            },
            error: function (error) {

            }
        });

    };


    var deleteComment = function (postIndex, commentIndex) {
        posts[postIndex].comments.splice(commentIndex, 1);
        _renderComments(postIndex);
    };

    return {
        addPost: addPost,
        removePost: removePost,
        addComment: addComment,
        deleteComment: deleteComment,
    };
};


var app = SpacebookApp();

$('#addpost').on('click', function () {
    var $input = $("#postText");
    if ($input.val() === "") {
        alert("Please enter text!");
    } else {
        app.addPost($input.val());
        $input.val("");
    }
});

var $posts = $(".posts");


$posts.on('click', '.remove-post', function () {
    var index = $(this).closest('.post').index();;
    app.removePost(index);
});

$posts.on('click', '.toggle-comments', function () {
    var $clickedPost = $(this).closest('.post');
    $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

    var $comment = $(this).siblings('.comment');
    var $user = $(this).siblings('.name');

    if ($comment.val() === "" || $user.val() === "") {
        alert("Please enter your name and a comment!");
        return;
    }

    var postIndex = $(this).closest('.post').index();
    var newComment = { text: $comment.val(), user: $user.val() };

    app.addComment(newComment, postIndex);

    $comment.val("");
    $user.val("");

});

$posts.on('click', '.remove-comment', function () {
    var $commentsList = $(this).closest('.post').find('.comments-list');
    var postIndex = $(this).closest('.post').index();
    var commentIndex = $(this).closest('.comment').index();

    app.deleteComment(postIndex, commentIndex);
});
