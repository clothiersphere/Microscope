//Posts collection needs to be available to entire app so var is omitted from Posts. (var Posts)
Posts = new Mongo.Collection('posts');

// for a successful insert , one or more callback as well as every callback will be executed.
Posts.allow({
	update: function (userId, post) { return ownsDocument(userId, post); }, 
	remove: function (userId, post) { return ownsDocument(userId, post); },
});

// If everything’s normal, that array should be empty and its length should be 0. If someone is trying anything funky, that array’s length will be 1 or more, and the callback will return true (thus denying the update).
Posts.deny({
	update: function(userId, post, fieldNames) {
	    // may only edit the following two fields:
	return (_.without(fieldNames, 'url', 'title').length > 0); 
	}
});

// Just like we did for the post submit form, we’ll also want to validate our posts on the server. 
// Except that you’ll remember we’re not using a method to edit posts, but an update call directly from the client.

// we want to validate the update so we call validatePost 
// on the contents of modifier.$set property (as in Posts.update({$set: {title: ..., url: ...}}) ).
//operation will fail if any of the denys return true - update will only succeed if it’s only targeting the title and url fields, as well as if neither one of these fields are empty.
Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    // console.log(modifier.$set)
    console.log(modifier, 'modifier')
    console.log(post, 'post')
    console.log(fieldNames, 'fieldNames')
    return errors.title || errors.url;
  }
});

validatePost = function (post) { 
	var errors = {};
	
	if (!post.title)
		errors.title = "Please fill in a headline";
	
	if (!post.url)
		errors.url = "Please fill in a URL";
	
	return errors; 
}

Meteor.methods({
	postInsert: function (postAttributes) {
		check(this.userId, String);
		check(postAttributes, {
			title: String,
			url: String
		});

		var errors = validatePost(postAttributes); 
		if (errors.title || errors.url)
			throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

		var postWithSameLink = Posts.findOne({url: postAttributes.url}); 
		if (postWithSameLink) {
			return {
				postExists: true,
				_id: postWithSameLink._id
			} 	
		}

		var user = Meteor.user();
		var post = _.extend(postAttributes, {
			userId: user._id, 
			author: user.username, 
			submitted: new Date(),
			commentsCount: 0
		});
		
		var postId = Posts.insert(post);
		
		return {
		_id: postId
		}; 
	}
});