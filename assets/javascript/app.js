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
	var trainName = $('#trainNameInput').val().trim();
	var destination = $('#destinationInput').val().trim();
	var firstTrain = moment($('#firstTrainInput').val().trim(), 'HH:mm').format('HH:mm');
	var frequency = $('#frequencyInput').val().trim();
	// Creates local 'temporary' object for holding employee data
	var addTrain = {
		name:  trainName,
		location: destination,
		start: firstTrain,
		rate: frequency
	};
	// Uploads employee data to the database
	database.ref().push(trainName);
	// Logs everything to console
	console.log(trainName.name);
	console.log(trainName.location);
	console.log(trainName.start);
	console.log(trainName.rate);
	// Clears all of the text-boxes
	$('#trainNameInput').val("");
	$('#destinationInput').val("");
	$('#firstTrainInput').val("");
	$('#frequencyInput').val("");
	// Prevents moving to new page
	return false;
});
// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on('child_added', function(childSnapshot, prevChildKey) {

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().name;
	var destination = childSnapshot.val().location;
	var firstTrain = childSnapshot.val().start;
	var frequency = childSnapshot.val().rate;

	// Employee Info
	console.log(trainName);
	console.log(destination);
	console.log(firstTrain);
	console.log(frequency);



	// First Time (pushed back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTime,'hh:mm').subtract(1, 'years');
	console.log(firstTimeConverted);

	// Current Time
	var currentTime = moment();
	console.log('CURRENT TIME: ' + moment(currentTime).format('HH:mm'));

	// Difference between the times
	var timeDifference = moment().diff(moment(firstTimeConverted), 'minutes');
	console.log('DIFFERENCE IN TIME: ' + timeDifference);

	// Time apart (remainder)
	var timeGap = timeDifference % frequency;
	console.log(timeGap);

	// Minute Until Train
	var minutesAway = frequency - timeGap;
	console.log('MINUTES TILL TRAIN: ' + minutesAway);

	// Next Train
	var nextArrival = moment().add(minutesAway, 'minutes');
	console.log('ARRIVAL TIME: ' + moment(nextArrival).format('HH:mm'))

	// Add each train's data into the table
	$('#trainTable > tbody').append('<tr><td>' + trainName + '</td><td>' + destination + '</td><td>' + frequency + '</td><td>' + (moment(nextArrival).format('HH:mm')) + '</td><td>' + minutesAway + '</td></tr>');

});
