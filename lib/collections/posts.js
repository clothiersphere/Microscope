//Posts collection needs to be available to entire app so var is omitted from Posts. (var Posts)
Posts = new Mongo.Collection('posts');

// for a successful insert , one or more callback as well as every callback will be executed.
Posts.allow({
	update: function(userId, post) { return ownsDocument(userId, post); }, 
	remove: function(userId, post) { return ownsDocument(userId, post); },
});

// If everything’s normal, that array should be empty and its length should be 0. If someone is trying anything funky, that array’s length will be 1 or more, and the callback will return true (thus denying the update).
Posts.deny({
update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
return (_.without(fieldNames, 'url', 'title').length > 0); }
});

Meteor.methods({
	postInsert: function(postAttributes) {
		check(Meteor.userId(), String);
		check(postAttributes, {
			title: String,
			url: String
		});

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
			submitted: new Date()
		});
		
		var postId = Posts.insert(post);
		
		return {
		_id: postId
		}; 
	}
});