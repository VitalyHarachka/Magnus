$( document ).ready(function() {
    populateProfile(true);
})

class user {
    constructor(name, course, year, attendance, currentLocation, detections, totalHours, totalActivity) {
        this.name = name;
        this.course = course;
        this.year = year;
        this.attendance = attendance;
        this.currentLocation = currentLocation;
        this.detections = detections;
        this.totalHours = totalHours;
        this.totalActivity = totalActivity;
    }
}

function getUserData(userType){
    var name = generateName();
    var course = generateCourse();
    var year = generateYear(userType);
    var attendance = calculateAttendance(user, 'current');
    var detections = generateDetections();
    var totalHours = generateTotalHours();
    var totalActivity = generateTotalActivity(totalHours);
    var currentLocation = detections[0][0];

    var newUser =  new user(name, course, year, attendance, currentLocation, detections, totalHours, totalActivity);

    return(newUser);
}
 
 function populateProfile(session){
    let user = getUserData('Student');   //getUserData(session); //Function to reterive current session data
    populateHeader(user);
    populateCameraDetections(user);
    populateCampusActivity(user);
}

function populateHeader(user){
    populateTitle(user);
    populateAttendance(user);
}

function populateTitle(user){
    
    var userProfilePictureOutput = document.getElementById("userProfilePicture");
    var userNameOutput = document.getElementById("userName");
    var userCourseOutput = document.getElementById("userCourse");
    var userYearOutput = document.getElementById("userYear");
    var userCurrentLocationOutput = document.getElementById("userCurrentLocation");
    var userFavouredLocationOutput = document.getElementById("userFavouredLocation");

    userProfilePictureOutput.innerText =     setUserPicture(); 
    userNameOutput.innerText =               user.name;
    userCourseOutput.innerText =             user.course;
    userYearOutput.innerText =               user.year;
    userCurrentLocationOutput.innerText =    user.currentLocation;
    userFavouredLocationOutput.innerText=    user.totalActivity[0][0];;
}

function populateAttendance(user){
    // As for right now just check how many days they have come in in total
    var userAttendance = user.attendance;
    var userPastAttendance = calculateAttendance(user, 'previous');
    var userAttendanceDelta = userAttendance - userPastAttendance;

    var userAttendanceOutput = document.getElementById("userAttendance");
    var userAttendanceDeltaOutput = document.getElementById("userAttendanceDelta");

    userAttendanceOutput.innerText =            userAttendance + "%";
    userAttendanceDeltaOutput.innerText=        userAttendanceDelta.toFixed(2) + "%";
    if(userAttendanceDelta > 0) userAttendanceDeltaOutput.style.color = "#3fdd2a";
    else{
        userAttendanceDeltaOutput.style.color = "#f5365c";
    } 
}

function calculateAttendance(user, currentOrPrevious){
    
    var attendance;

    var totalDays = calculateTotalDays(currentOrPrevious);
    var arrivals = generateArrivals(totalDays, currentOrPrevious, user);

    // Search tables for every instance of 'entrance'

    //attendance = (arrivals != 0) ? ((arrivals/totalDays) * 100).toFixed(2) : 0;

    if(arrivals != 0){
        attendance = ((arrivals/totalDays) * 100).toFixed(2);
    }
    else{
        attendance = 0;
    }
    return attendance;
}

function generateArrivals(totalDays, currentOrPrevious, user){
    var arrivals;
    if(currentOrPrevious == 'current'){
        arrivals = (Math.floor(Math.random() * (totalDays*0.5)) + (totalDays * 0.5));
    }
    else{
        var currentAttendance = user.attendance;
        var arrivalsEstimate = totalDays * (currentAttendance/100);
        var posOrNeg = (Math.floor(Math.random() * 2));
        var change = ((Math.floor(Math.random() * 4)) + 1) * 0.01;
        if(posOrNeg == 0)arrivals = arrivalsEstimate + arrivalsEstimate*change;
        else arrivals = arrivalsEstimate + arrivalsEstimate*(-change);
    }
    return arrivals;
}

function calculateTotalDays(currentOrPrevious){
    var today = moment();

    if(currentOrPrevious == 'previous'){
        today = moment().subtract(1, 'months');
    }

    var startOfTerm;

    if(today.month() <= 8){
        startOfTerm = moment([today.year(), 8, 01]).subtract(1, 'y')
    }
    else{
        startOfTerm = moment([today.year(), 8, 01])
    }

    return today.diff(startOfTerm, 'days');
}

function findFavouredLocation(user){ /// ########################## Possible Delete
    var locationVisits = new Map();
    locationVisits.set('The Point',         0);
    locationVisits.set('Clifton Library',   0);
    locationVisits.set('Mary Ann Evans',    0);
    locationVisits.set('Erasmus Darwin',    0);
    locationVisits.set('New Hall Block',    0);
    locationVisits.set('Pavillion',         0);

    var userDetections = ['The Point', 'The Point', 'The Point', 'The Point', 'The Point', 'Clifton Library', 'Mary Ann Evans','Mary Ann Evans','Mary Ann Evans', 'Pavillion'] /* getAllUserDetection(user) */ ; // Returns a lsit of all detections of the user
    var mostVisitedLocation = "";
    var amountOfVisits = 0;

    for(var detectionLocation of userDetections){
        for(var[location, visits] of locationVisits){
            if(location == detectionLocation){
                locationVisits.set(location, visits+1)
            }
        }
    }

    for(var[location, visits] of locationVisits){
        if(visits > amountOfVisits){
            amountOfVisits = visits;
            mostVisitedLocation = location;
        }
    }

    return mostVisitedLocation;
}

function populateCameraDetections(user){

    for(set = 1; set <=5; set++){
        var userDetectionLocationOutput = document.getElementById("userDetectionLocation" + set);
        var userDetectionEnteranceOutput = document.getElementById("userDetectionEnterance" + set);
        var userDetectionExitOutput = document.getElementById("userDetectionExit" + set);
        var userDetectionAccademicOutput = document.getElementById("userDetectionAccademic" + set);

        var accademic = user.detections[set-1][3];
        var symbol = '<i class="fas fa-spinner"></i>';
        if (accademic == true){
             symbol = '<i class="fas fa-check"></i>';
        }
        if(accademic == false){ 
            symbol = '<i class="fas fa-times"></i>';
        }

        userDetectionLocationOutput.innerText = user.detections[set-1][0];
        userDetectionEnteranceOutput.innerText = user.detections[set-1][1];
        userDetectionExitOutput.innerText = user.detections[set-1][2];
        userDetectionAccademicOutput.innerHTML = symbol;
    }
}

function populateCampusActivity(user){
    for(set = 1; set <=5; set++){
        var userActivityLocaitonOuput = document.getElementById("userActivityLocaiton" + set);
        var userActivityVisitsOuput = document.getElementById("userActivityVisits" + set);
        var userActivityTotalOuput = document.getElementById("userActivityTotal" + set);
        var userActivityPercentageOutput = document.getElementById("bar-userActivityTotal" + set);

        var visitTime = user.totalActivity[set - 1][2];
        var percentage = (visitTime / user.totalHours) * 100;
        if(percentage < 5) percentage = 5;
        if(visitTime < 10) visitTime += " ";
        if(visitTime < 100) visitTime += " ";

        userActivityLocaitonOuput.innerText = user.totalActivity[set - 1][0];
        userActivityVisitsOuput.innerText = user.totalActivity[set - 1][1];
        userActivityTotalOuput.innerText = visitTime + "hrs";
        userActivityPercentageOutput.style = "width: "+ percentage +"%;";
    }
}

function generateName(){
    var fullName = "";

    var firstNames = ["Alex", "Anna", "Andy", "Abby","Ben","Betty","Brendon","Calvin","Connor","Celina","Drew","Danny","Dannie","Edgar","Edward","Elizabeth","Ellie","Frank","Frankie","Julie","Zac","George","Beth","Jenny","Matt","Robbert","Steve","Siobhan","Sam","Mohammed","Harry", "Callum", "Amor", "Jessie", "Matthew", "Usman", "Wei", "Ying"];
    var lastNames = ["Robberts", "Matthews", "Johnson", "DeSanta", "Sorola", "Smith", "Jones", "Hayward", "Micheals", "Way", "Styles", "Barnes", "Barnett", "Collins", "Freeman", "Jenkins", "Duley", "Best", "Willows", "McDonald", "McCane", "Trove", "Dixon", "Tinsley", "Kulpa", "Hart", "Robinson", "Crane", "Chen", "Wang", "Arain", "Farooqi"];

    var chosenName = firstNames[(Math.floor(Math.random() * firstNames.length))];
    fullName = chosenName + " ";

    if ((Math.floor(Math.random() * 10) == 0)){
        chosenName = lastNames[(Math.floor(Math.random() * lastNames.length))];
        fullName += chosenName + "-";
        }
        
    chosenName = lastNames[(Math.floor(Math.random() * lastNames.length))];
    fullName += chosenName;

    return fullName;
}

function generateCourse(){
    var coursesSc = ["Animal Behavior","Astrophysics","Biochemistry","Biology","Biotechnology","Chemistry","Cognitive Science","Computer Science","Geography","Mathematics","Microbiology","Neuroscience","Physics","Psychology","Statistics"]
    var courseA = ["French","Gender Studies","Geography","Geological Sciences","Germanic Studies","History","History of Art","Human Biology","India Studies","International Studies","Italian","Linguistics","Microbiology","Philosophy"]
    var degreesSc = ["BSc", "MSc", "PhD"]
    var degreeA = ["BA", "MA", "PhD"]
    var chosenCourse;

    var coursePath = Math.floor(Math.random() * 2);
    if(coursePath == 0){
        var chosenCourse = coursesSc[(Math.floor(Math.random() * coursesSc.length))];
        chosenCourse += (" "+ "("+degreesSc[(Math.floor(Math.random() * degreesSc.length))]+")");
    }
    else{
        var chosenCourse = courseA[(Math.floor(Math.random() * courseA.length))];
        chosenCourse += (" "+ "("+degreeA[(Math.floor(Math.random() * degreeA.length))]+")");
    }
    return chosenCourse;
}

function generateYear(userType){
    var year;
    if(userType == 'Student'){
        var generatedYear = (Math.floor(Math.random() * 2) + 1);
        year = generatedYear;
        if(generatedYear == 1) year += "st";
        else if(generatedYear == 2) year+= "nd";
        else if(generatedYear == 3) year+= "rd";
        year += " Year Student";
        return year;
    }
    else return userType;
}

function generateLocation(){
    var locations = ['The Point','Clifton Library','Mary Ann Evans','Erasmus Darwin','Pavillion','John Clare','Ada Byron King'];
    var i = (Math.floor(Math.random() * locations.length));
    var chosenLocation = locations[i];
    return chosenLocation;
}

function generateDetections(){
    var detections = [];
    var accademicLocations = ['Clifton Library','Mary Ann Evans','Erasmus Darwin','John Clare','Ada Byron King'];
    var stay;
    var currentTime = moment();
    currentTime.set('hour', 9);
    currentTime.set('minute', 0);
    

    for(var i = 0; i < 100; i++){
        var currentDetection = [];
        var accademic = false;

        var currentLocation = generateLocation();
        
        currentDetection.push(currentLocation);
        var min = (currentTime.minute() < 10) ? ("0" + currentTime.minute()) : currentTime.minute();
        currentDetection.push((currentTime.hour() + ":" + min));
        
        var visitType = (Math.floor(Math.random() * 5));
        if(visitType == 0) stay = (Math.floor(Math.random() * 5) + 1);
        else{
            if(accademicLocations.includes(currentLocation)) accademic = true;
            if (visitType == 4) {
                stay = (Math.floor(Math.random() * 60) + 120);
            }
            else {
                stay = (Math.floor(Math.random() * 30) + 45);
            }
        }
       
        if(i == 99){
            currentDetection.push(" - ");
            currentDetection.push(" - ");
        }
        else{
            currentTime.add(stay, 'minutes');
            min = (currentTime.minute() < 10) ? ("0" + currentTime.minute()) : currentTime.minute();
            currentDetection.push((currentTime.hour() + ":" + min));
            currentDetection.push(accademic);
        }

        if(currentTime.hour() >= 18){
            var timeOfEntry = (Math.floor(Math.random() * 2));
            currentTime.set('hour', 9);
            currentTime.set('minute', 0);
            currentTime.add(timeOfEntry, 'hour')
        } 
        else{
            var travelTime = (Math.floor(Math.random() * 5)+1);
            currentTime.add(travelTime, 'minutes');
        }

        detections.push(currentDetection);
    }
    return detections.reverse();
}

function generateTotalHours(){
    var totalHours = (Math.floor(Math.random() * 600) + 400);
    return totalHours;
}

function generateTotalActivity(totalHours){
    var locations = ['The Point','Clifton Library','Mary Ann Evans','Erasmus Darwin','Pavillion','John Clare','Ada Byron King'];
    var totalActivity = [];

    for(var i = 0; i < locations.length; i++){
        var currentActivity = [];
        while(true){
            var amountOfHours = (Math.floor(Math.random() * 250));
            if((totalHours - amountOfHours) >= 0){
                break;
            }
        }
        var averageVisits = Math.floor(amountOfHours / 0.75);
        currentActivity = [locations[i], amountOfHours, averageVisits];
        totalActivity.push(currentActivity);
        totalHours -= amountOfHours;
    }
    totalActivity = selectionSort(totalActivity);
    return totalActivity;
}

var selectionSort = function(arr){
  for(var i = 0; i < arr.length; i++){
    var min = i;
    for(var j = i+1; j < arr.length; j++){
      if(arr[j][1] > arr[min][1]){
        min = j;
      }
    }
    swapElements(arr, i, min);
  }
  return arr;
}

var swapElements = function(arr, first, second){
    var temp = arr[first];
    arr[first]  = arr[second];
    arr[second] = temp;
}

function setUserPicture(){
    var profilePicture = document.getElementById("userProfilePicture");
    profilePicture.src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-eye-512.png";
}

