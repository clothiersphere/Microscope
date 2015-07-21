//Posts collection needs to be available to entire app so var is omitted from Posts. (var Posts)
Posts = new Mongo.Collection('posts');

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