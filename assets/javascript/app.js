var config = {
    apiKey: 'AIzaSyAM1ephpk1c2mrwZvORbqcr8ur4LaJmEpc',
    authDomain: 'train-schedule-947d7.firebaseapp.com',
    databaseURL: 'https://train-schedule-947d7.firebaseio.com',
    storageBucket: 'train-schedule-947d7.appspot.com',
  };
  firebase.initializeApp(config);

var database = firebase.database();

$('#addTrainBtn').click(function(e) {
	e.preventDefault();

	// Grabs user input
	var train = $('#trainInput').val().trim();
	var destination = $('#destinationInput').val().trim();
	var startingTrain = moment($('#startingTrainInput').val().trim(), 'HH:mm').format('HH:mm');
	var frequency = $('#frequencyInput').val().trim();
	// Creates local 'temporary' object for holding train data
	var addTrain = {
		name:  train,
		location: destination,
		start: startingTrain,
		rate: frequency
	};
	// Uploads train data to the database
	database.ref().push(addTrain);
	// Logs everything to console
	console.log(addTrain.name);
	console.log(addTrain.location);
	console.log(addTrain.start);
	console.log(addTrain.rate);
	// Clears all of the text-boxes
	$('#trainInput').val("");
	$('#destinationInput').val("");
	$('#startingTrainInput').val("");
	$('#frequencyInput').val("");
	
	return false;
});

database.ref().on('child_added', function(childSnapshot, prevChildKey) {
	console.log(childSnapshot.val());

	var train = childSnapshot.val().name;
	var destination = childSnapshot.val().location;
	var startingTrain = childSnapshot.val().start;
	var frequency = childSnapshot.val().rate;

		console.log(train);
		console.log(destination);
		console.log(startingTrain);
		console.log(frequency);

	// First Time (pushed back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(startingTrain,'HH:mm').subtract(1, 'years');
	console.log(firstTimeConverted);

	// Current Time
	var currentTime = moment();
	console.log('Current Time: ' + moment(currentTime).format('HH:mm'));

	// Difference between the times
	var timeDifference = moment().diff(moment(firstTimeConverted), 'minutes');
	console.log('Time Difference: ' + timeDifference);

	// Time apart (remainder)
	var timeGap = timeDifference % frequency;
	console.log(timeGap);

	// Minutes Until Train
	var minutesAway = frequency - timeGap;
	console.log('Minutes Away: ' + minutesAway);

	// Next Train
	var nextArrival = moment().add(minutesAway, 'minutes');
	console.log('Next Train Arrival Time: ' + moment(nextArrival).format('HH:mm'))

	// Adds each train's data into the table
	$('#trainTable > tbody').append('<tr><td>' + train + '</td><td>' + destination + '</td><td>' + frequency + '</td><td>' + (moment(nextArrival).format('HH:mm')) + '</td><td>' + minutesAway + '</td></tr>');

});
