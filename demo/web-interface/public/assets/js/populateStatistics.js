var LVCChart;
var searchType = 'General';
var daysPrevious = 30;

$( document ).ready(function() {
    populateStatistics();
})

$("#button-Student").click(function (e) {
    searchType = 'Students';
    LVCChart.destroy();
    populateActivity();
    var LVCHeaderOutput = document.getElementById("header-LVC");
    LVCHeaderOutput.innerText = "Student Activity";
});

$("#button-Staff").click(function (e) {
    searchType = 'Staff';
    LVCChart.destroy();
    populateActivity();
    var LVCHeaderOutput = document.getElementById("header-LVC");
    LVCHeaderOutput.innerText = "Staff Activity";
});

$("#button-Guest").click(function (e) {
    searchType = 'Guests';
    LVCChart.destroy();
    populateActivity();
    var LVCHeaderOutput = document.getElementById("header-LVC");
    LVCHeaderOutput.innerText = "Guest Activity";
});

$("#button-General").click(function (e) {
    searchType = 'General';
    LVCChart.destroy();
    populateActivity();
    var LVCHeaderOutput = document.getElementById("header-LVC");
    LVCHeaderOutput.innerText = "General Activity";
});

$("#button-previous30").click(function (e) {
    daysPrevious = 30;

    LVCChart.destroy();
    populateActivity();
});

$("#button-previous302").click(function (e) {
    daysPrevious = 60;

    LVCChart.destroy();
    populateActivity();
});

$("#button-previous90").click(function (e) {
    daysPrevious = 90;

    LVCChart.destroy();
    populateActivity();
});

function populateStatistics(){
    var user /* = getUserData(session) */ ; //Function to reterive current session data
    populateActivity();
    populateCurrentCampusActivity();
}

function populateActivity(){
    var locationVisits = getLocationVisits(daysPrevious, searchType);
    var dates = getDates(daysPrevious);
    setVisitGraph(dates, locationVisits);
}

function populateCurrentCampusActivity(){
    var totalPopulation = getTotalPeopleOnCampus();
    var globalLocations = getGlobalLocations(totalPopulation);

    for(set = 1; set <=7; set++){
        var CCALocationOutput = document.getElementById("CCALocation" + set);
        var CCAPeopleOutput = document.getElementById("CCAPeople" + set);
        var CCAPercentOutput = document.getElementById("CCAPercent" + set);

        var locationPopulation = globalLocations[set-1][1]; 
        var percentage = (locationPopulation !=0) ? ((locationPopulation / totalPopulation) * 100).toFixed(2) : 0;

        CCALocationOutput.innerHTML = globalLocations[set-1][0];
        CCAPeopleOutput.innerHTML = globalLocations[set-1][1];
        CCAPercentOutput.innerHTML = percentage + "%";
    }
}

function getLocationVisits(daysBack, userType){

    var locationVisits = new Map();
    locationVisits.set('The Point',          [0]);
    locationVisits.set('Clifton Library',    [0]);
    locationVisits.set('Mary Ann Evans',     [0]);
    locationVisits.set('Erasmus Darwin',     [0]);
    locationVisits.set('New Hall Block',     [0]);
    locationVisits.set('Pavillion',          [0]);
    locationVisits.set('John Clare',         [0]);
    locationVisits.set('Ada Byron King',     [0]);

    var currentDate = moment();

    for(var[location, visits] of locationVisits){
      var visitsEachDay = [0];
      for(var day = 0; day < daysBack; day++){
          var dateToFind = (currentDate.date() + " / " + currentDate.month() + " / " + currentDate.year());
        
        
        var detectionsOnDate = getActivity(dateToFind, userType);
         
        for(var detectionLocation of detectionsOnDate){
          if(location == detectionLocation){
            visitsEachDay[day] += 1;
          }
        }
        if(day != daysBack-1) visitsEachDay.push(0);
      }
      locationVisits.set(location, visitsEachDay);
    }
      
    return locationVisits
}

function getDates(daysBack){
    var currentDate = moment();
    var dates = [];
    for(i = 0; i < daysBack; i++){
        currentDate.subtract(1, 'days');
        dates.push((currentDate.date() + " / " + (currentDate.month()+1)));
    }
    return dates.reverse();
}

function setVisitGraph(dates, locationVisits){

    var ctx = document.getElementById("chart-LVC");   // Get canvas 

    LVCChart = new Chart(ctx, {                  //Create chart
    type: 'line',                                 // Define type as line chart
    data:{
            labels: dates,                          // Sets (x-axis) labels
            datasets: [                             // Defines what data is used for chart
                {
                    data: (locationVisits.get('The Point')),
                    label: "The Point",
                    backgroundColor: "#E37376",
                    borderColor: "#E37376",
                    fill : false
                },
                {
                    data: (locationVisits.get('Pavillion')),
                    label: "Pavillion",
                    backgroundColor: "#DE80AB",
                    borderColor: "#DE80AB",
                    fill : false
                },
                {
                    data: (locationVisits.get('Mary Ann Evans')),
                    label : "Mary Ann Evans",
                    backgroundColor : "#B69BD5",
                    borderColor: "#B69BD5",
                    fill : false,
                    hidden: true                },
                {
                    data: (locationVisits.get('Erasmus Darwin')),
                    label : "Erasmus Darwin",
                    backgroundColor : "#71B7E4",
                    borderColor: "#71B7E4",
                    fill : false,
                    hidden: true
                },
                {
                    data: (locationVisits.get('New Hall Block')),
                    label : "New Hall",
                    backgroundColor : "#1ECCD2",
                    borderColor: "#1ECCD2",
                    fill : false,
                    hidden: true
                },
                {
                    data: (locationVisits.get('Clifton Library')),
                    label : "Clifton Library",
                    backgroundColor : "#47D9A6",
                    borderColor: "#47D9A6",
                    fill : false
                },
                {
                    data: (locationVisits.get('John Clare')),
                    label : "John Clare",
                    backgroundColor : "#96DD73",
                    borderColor: "#96DD73",
                    fill : false
                },
                {
                    data: (locationVisits.get('Ada Byron King')),
                    label : "Ada Byron King",
                    backgroundColor : "#E2D753",
                    borderColor: "#E2D753",
                    fill : false,
                    hidden: true
                }
            ]
        }
    });

    LVCChart.responsive = true;
    LVCChart.maintainAspectRatio = false;
}

function getActivity(dateToFind, userType){
    // Spoof Data until can grab data from database - Detections = SELECT * WHERE DATE = dateToFind AND ENTRACNE = True AND USERTYPE = userType

    var amountOfUsers = 0;
    if(userType == 'Students') amountOfUsers = 2000 + (Math.floor(Math.random() * 500));
    else if (userType == 'Staff') amountOfUsers = 200 + (Math.floor(Math.random() * 100));
    else if (userType == 'Guests') amountOfUsers = 20 + (Math.floor(Math.random() * 80));
    else if(userType == 'General') amountOfUsers = 2000 + 200 + 20 + (Math.floor(Math.random() * 680));

    var detectionLocations = [];
    var locations = ['The Point', 'Clifton Library',  'Mary Ann Evans','New Hall Block', 'Pavillion','Erasmus Darwin', 'John Clare', 'Ada Byron King'];
    for(i = 0; i < amountOfUsers; i++){
        var randomNum = (Math.floor(Math.random() * 8));
        var generatedDetection = locations[randomNum];
        detectionLocations.push(generatedDetection);
    }
    return detectionLocations;
}

function getTotalPeopleOnCampus(){
    // Spoof data until can grab real data from API - = SELECT * WHERE EXIT_TIME = 'NaN'
    return (2000 + (Math.floor(Math.random() * 1000)))
}

function getGlobalLocations(population){
    var currentPopulationLeft = population;

    var locationVisits = [
        ['The Point',           0],
        ['Clifton Library',     0],
        ['Mary Ann Evans',      0],
        ['Erasmus Darwin',      0],
        ['Pavillion',           0],
        ['John Clare',          0],
        ['Ada Byron King',      0]
    ];

    for(i = 0; i < locationVisits.length; i++){
        while(true){
            var randomPopulation = (Math.floor(Math.random() * 400));
            if((currentPopulationLeft - randomPopulation) >= 0){
                break;
            }
        }
        locationVisits[i][1] = randomPopulation;
        currentPopulationLeft -= randomPopulation;
    }
    locationVisits = bubbleSortVisits(locationVisits);
    return locationVisits;
}

function bubbleSortVisits(arr){

    var len = arr.length,
        i, j, stop,
        temp;

    for (i=0; i < len; i++){
        for (j=0, stop=len-1; j < stop; j++){
            if (arr[j][1] > arr[(j+1)][1]){
              temp = arr[(j+1)];
              arr[(j+1)] = arr[j];
              arr[j] = temp;
            }
        }
    }
    return arr.reverse();
}