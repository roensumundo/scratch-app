const SERVER_URL = 'http://localhost:9026';
// For sign-up request
const signup = async (username, password, isTrainer, fullname, age, location, gender) => {
  // Send a POST request with user information to the server
  const response = await fetch(SERVER_URL + '/signup', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, isTrainer, fullname, age, location, gender })
  });
  // Parse the response JSON data
  const data = await response.json();
  // Handle the response based on its type
  if (data.type === 'signup') {
    if (data.message === 'Successful') {
      // If signup was successful, set user information and redirect to main page
      APP.IAmTrainer = isTrainer;
      APP.setUser(username, fullname, age, location, gender);
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
  // Send a POST request with login information to the server
  const response = await fetch(SERVER_URL +'/login', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  // Parse the response JSON data
  const data = await response.json();
  // Handle the response based on its type
  if (data.type === 'login') {
    if (data.message === 'Successful') {
      // If login was successful, set user information and redirect to main page
      const username = data.content.username;
      const fullname = data.content.name;
      const isTrainer = data.content._isTrainer;
      const gender = data.content.gender;
      const age = data.content.age;
      const location = data.content.location;
      APP.IAmTrainer = isTrainer;
      APP.setUser(username, fullname, age, location, gender);
      goToPage(PAGES.MAIN);
    } else {
      // Display an error message to the user
      alert(data.message);
    }
  }
};

// For publishing a class
const sendClass = async (class_object) => {
  // Send a POST request with class information to the server
  const response = await fetch(SERVER_URL +'/publish_class', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(class_object)
  });
  // Parse the response JSON data
  const data = await response.json();
  if (data.type === 'saved_class') {
    if (data.message === 'Successful') {
      // If class publishing was successful, return the class id assigned by the server
      console.log('Class Successfully created');
      return data.id;
    }
    else {
      // If class publishing failed, return null
      console.log("Class not published properly");
      return null;
    }
  }
}
// For class enrollment. 
const sendEnrollment = async (username, class_id) => {
  // Send a POST request with enrollment information to the server
  const response = await fetch(SERVER_URL +'/enrollment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({username, class_id})
  });
  // Parse the response JSON data
  const data = await response.json();
  if (data.type === 'enrollment') {
    if (data.message === 'Successful') {
      
      console.log('Enrollment completed successfully');
      const class_data = data.content;
      //TODO Add user to class
      const class_object = new Class(class_data.title, class_data.category, class_data.description, class_data.datetime, class_data.duration, class_data.creator, class_data.level, class_data.price, class_data.maxUsers);
      class_object.id = class_data.id;
      class_object.enrollUser(username);
      //TODO Add class to user
      APP.my_user.enrollClass(class_object.id, class_object);


    }
    else {
      console.log("Enrollment could not be completed.");
    }
  }
}

// Ask for a certain class offer by id

const askForClassInfo = async (class_id) => {
  // Send a POST request with enrollment information to the server
  const response = await fetch(SERVER_URL +'/class_info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({class_id})
  });
  // Parse the response JSON data
  const data = await response.json();
  if (data.type === 'class_info') {
    if (data.message === 'Successful') {
      
      console.log('Class info retrieved successfully');
      return data.content;
    }
    else {
      console.log("Enrollment could not be completed.");
    }
  }
}
// Ask for enrolled classes.
const askForEnrolledClasses = async (username) => {
  // Send a POST request with username information to the server
  const response = await fetch(SERVER_URL +'/my_enrollments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username})
  });
  // Parse the response JSON data
  const data = await response.json();
  if (data.type == "enrollments_list") {
    if (data.message == "Successful") {
      //console.log("Enrollment dict for user " + username + ": "+ JSON.stringify(data.content));
      let classes_dict = data.content;
      console.log("data received by server" + JSON.stringify(classes_dict));

      // Loop through the received classes and add them to the user's enrolled classes
      for (const class_id in classes_dict) {
        let class_object = classes_dict[class_id]
        console.log(JSON.stringify(class_object));
        let title = class_object.title;
        let category = class_object.category;
        let description = class_object.description;
        let datetime = class_object.datetime;
        let duration = class_object.duration;
        let creator = class_object.creator;
        // Save class in enrolled classes user's list. 
        APP.my_user.enrolledClasses[class_id] = new Class(title, category, description, datetime, duration, creator);
        APP.my_user.enrolledClasses[class_id].id = class_id;
      }
      console.log(APP.my_user.enrolledClasses);
    } else {
      console.log("Couldn't retrieve enrolled classes");
    }
  }
}
// Function to navigate to a new page and update the app state
function goToPage(page) {
  APP.current_page = page;
  localStorage.setItem('APP', JSON.stringify(APP));
  const new_page = '/' + page + '/' + page + '.html';
  history.pushState({}, null, new_page);
  window.location.href = new_page;
  
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