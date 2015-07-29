// The moveElement function we just defined will be called whenever an element’s 
// position changes instead of Blaze’s default behavior. And since the function is empty, this means nothing will happen.
Template.postsList.onRendered(function () { 
	this.find('.wrapper')._uihooks = {
		// node is the element currently being moved to a new position in the DOM. 
		// next is the element right after the new position that node is being moved to.
		moveElement: function (node, next) { 
		// do nothing for now
		} 
	}
});