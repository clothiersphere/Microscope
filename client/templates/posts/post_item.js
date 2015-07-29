Template.postItem.helpers({ 
	ownPost: function() {
		return this.userId === Meteor.userId(); 
	},
	domain: function() {
		//create empty anchor (a) HTML element - set its href att = to current post URL.
		var a = document.createElement('a'); a.href = this.url;
		//use a hostname property to get back the link’s domain name without the rest of the URL.
		return a.hostname;
	},
	upvotedClass: function() {
		var userId = Meteor.userId();
		if (userId && !_.include(this.upvoters, userId)) {
			return 'btn-primary upvotable'; 
		} else {
		return 'disabled'; 
		}
	}
});

Template.postItem.events({ 
	'click .upvotable': function(e) {
    e.preventDefault();
		Meteor.call('upvote', this._id); }
});