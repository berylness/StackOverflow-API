
// This function takes the question object returned by StackOverflow and creates new result to be appended to DOM
// ** No changes made to this code **
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the # views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

// ** New function based on showSearchResults function **
var showAnswers = function(answer) {
	
	var result = $('.templates .answer').clone();
	
	// Displays the topAnswerer's reputation score 
	var score = result.find('.userscore');
	score.text(answer.score);

	// Displays the topAnswerer's post count 
	var postcount = result.find('.count');
	postcount.text(answer.post_count);

	// Displays the topAnswerer's name and reputation score 
	var answerer = result.find('.answerer');
	answerer.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + answer.user.user_id + ' >' +
													answer.user.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + answer.user.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow and creates info about search results to be appended to DOM
// ** No changes made to this code **
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
// ** No changes made to this code **
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched for on StackOverflow
// ** No changes to this section 
var getUnanswered = function(tags) {
	
	// Parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


// Added new function modeled on the getUnanswered function 
var getInspiration = function(answers) {
	
	// Parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: answers,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};

	// Added new endpoint based off the StackExchange API documentation  
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/"+answers+"/top-answerers/all_time",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})

	// Executes this block when and if the AJAX request returns successfully   
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var topUser = showAnswers(item);
			$('.results').append(topUser);
		});
	})
	// Executes this block when and if the AJAX request does not return successfully
	// ** No changes to this section
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

// Added new jQuery selector and a call for the getInspiration function 
$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// Removes the Results from any Previous Search
		$('.results').html('');
		// Displays the text of what was searched (for after the # of results found) 
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
	$('.inspiration-getter').submit( function(event){
		// Removes the Results from any Previous Search
		$('.results').html('');
		// Displays the text of what was searched (for after the # of results found) 
		var tags = $(this).find("input[name='answerers']").val();
		getInspiration(tags);
	});
});



