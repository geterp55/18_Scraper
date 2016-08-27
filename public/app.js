$.getJSON('/articles', function(data) {
	for (var i = 0; i < data.length; i++) {
    // Math.floor(Math.random());
		$('#articles').append('<p class="myArticles" data-id="' + data[i]._id + '">' + data[i].title + '<br />' + data[i].link + '</p>');
	// $('#articles').append('<p data-id="' + data._id + '">' + data.title + '<br />' + data.link + '</p>');
  }
});

$('.myArticles').click(function(){
	console.log("click working");
	var myID = $(this).attr('data-id');
	$.ajax({
  		  dataType: "json",
		  url: '/',
		  data: data,
		  success: success
	}).done(function(data){
		$('#notes').append('<p>' + data + '</p>');
	});
});


// function getResults(){
//   $('#articles').empty();
//   $.getJSON('/articles', function(data){
//     // for (var i = 0; i < data.length; i++) {
//       // $('#articles').append('<p data-id="' + data[i]._id + '">' + data[i].title + '<br />' + data[i].link + '</p>');
//       $('#articles').append('<p data-id="' + data._id + '">' + data.title + '<br />' + data.link + '</p>');
//     // }
//   });
// };
// getResults();





// function getResults(){
//   // empty any results currently on the page
//   $('#articles').empty();
//   // grab all of the current notes
//   $.getJSON('/all', function(data) {
//     // for each note...
//     for (var i = 0; i<data.length; i++){
//       // ...populate #results with a p-tag that includes the note's title
//       // and object id.
//       // $('#articles').prepend('<p class="dataentry" data-id=' +data[i]._id+ '><span class="dataTitle" data-id=' +data[i]._id+ '>' + data[i].title + '</span><span class=deleter>X</span></p>');
//       $('#articles').prepend('<p data-id="' + data[i]._id + '">' + data[i].title + '<br />' + data[i].link + '</p>');
//     }
//   });
// }

// // runs the getResults function as soons as the script is executed
// getResults();