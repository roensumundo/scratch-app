const SERVER_URL = 'http://localhost:9026';
// For sign-up request
const signup = async (username, password, isTrainer, fullname, age, location, gender) => {
    const response = await fetch(SERVER_URL + '/signup', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, isTrainer, fullname, age, location, gender })
    });
    const data = await response.json();
    console.log(data); // Handle server response
    // Handle the response based on its type
    if (data.type === 'signup') {
      if (data.message === 'Successful') {
        // Do something when login is successful, such as redirecting the user
        APP.IAmTrainer = isTrainer;
        APP.setUser(username, fullname, age, location, gender);
        //localStorage.setItem('APP', JSON.stringify(APP));
        goToPage(PAGES.MAIN);
      } else {
        // Display an error message to the user
        //TODO add text to DOM instead. 
        alert(data.message);
      }
    }
  };
  
  // For login request
  const login = async (username, password) => {
    const response = await fetch(SERVER_URL +'/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    // Handle the response based on its type
    console.log(data);
    if (data.type === 'login') {
      if (data.message === 'Successful') {
        const username = data.content.username;
        const fullname = data.content.name;
        const isTrainer = data.content._isTrainer;
        const gender = data.content.gender;
        const age = data.content.age;
        const location = data.content.location;
        APP.IAmTrainer = isTrainer;
        APP.setUser(username, fullname, age, location, gender);
        //localStorage.setItem('APP', JSON.stringify(APP));
        goToPage(PAGES.MAIN);
      } else {
        // Display an error message to the user
        alert(data.message);
      }
    }
  };

// For publishing a class
const sendClass = async (class_object) => {
  const response = await fetch(SERVER_URL +'/publish_class', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(class_object)
  });
  const data = await response.json();
  if (data.type === 'saved_class') {
    if (data.message === 'Successful') {
      //APP.my_user.createClass(data.id, class_object);
      //Save the class id assigned by the server.
      class_object.id = data.id;
      console.log('Class Successfully created');
    }
    else {
      console.log("Class not published properly");
    }
  }
}
// For class enrollment. 
const sendEnrollment = async (username, class_id) => {
  const response = await fetch(SERVER_URL +'/enrollment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({username, class_id})
  });
  const data = await response.json();
  if (data.type === 'enrollment') {
    if (data.message === 'Successful') {
      
      console.log('Enrollment completed successfully');
    }
    else {
      console.log("Enrollment could not be completed.");
    }
  }
}
// Ask for enrolled classes.
const askForEnrolledClasses = async (username) => {
  const response = await fetch(SERVER_URL +'/my_enrollments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username})
  });
  const data = await response.json();
  if (data.type == "enrollments_list") {
    if (data.message == "Successful") {
      console.log("Enrollment dict for user " + username + ": "+ JSON.stringify(data.content));
      let classes_dict = data.content;
      console.log("data received by server" + JSON.stringify(classes_dict));
      for (const class_id in classes_dict) {
        let class_object = classes_dict[class_id]
        console.log(JSON.stringify(class_object));
        let title = class_object.title;
        let description = class_object.description;
        let datetime = class_object.datetime;
        let duration = class_object.duration;
        let creator = class_object.creator;
        APP.my_user.enrolledClasses[class_id] = new Class(title, description, datetime, duration, creator);
        APP.my_user.enrolledClasses[class_id].id = class_id;
      }
      console.log(APP.my_user.enrolledClasses);
    } else {
      console.log("Couldn't retrieve enrolled classes");
    }
  }
}

function goToPage(page) {
  localStorage.setItem('APP', JSON.stringify(APP));
  const new_page = '/' + page + '/' + page + '.html';
  history.pushState({}, null, new_page);
  window.location.href = new_page;
  APP.current_page = page;
}
/*
  // For main page request 
  const main_page = async () => {
    const response = await fetch(SERVER_URL +'/main');
    const html = await response.text(); // get the response as text
    document.documentElement.innerHTML = html;
    APP.current_page = PAGES.MAIN;
    askForEnrolledClasses(APP.my_user.username);
    //TODO recomendation system
    //askForRecommendations();
    if (APP.IAmTrainer) {
      //askForPublishedClasses();
    }
  };
*/
  // TESTS 
//signup("rosa", "asdf");
const trainer = new Trainer("Ro", "ro");
const myDate = new Date(2023, 4, 30, 14, 30);
const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', min: 'numeric'};
const formattedDate = myDate.toLocaleDateString('en-US', options);
const class_offer = trainer.createClass("Squads", "infinit squads ", formattedDate, "2h", "advanced", "10", 8);
//console.log(JSON.stringify(class_offer));
//sendClass(class_offer);
//signup("new", "Rosaro77", true, "Rosa Alos");
//sendEnrollment("ma", "26");
//askForEnrolledClasses("ma");
//sendEnrollment("ma", "30");