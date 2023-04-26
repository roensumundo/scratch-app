const SERVER_URL = 'http://localhost:9026';
// For sign-up request
const signup = async (username, password, isTrainer, fullname) => {
    const response = await fetch(SERVER_URL + '/signup', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, isTrainer, fullname })
    });
    const data = await response.json();
    console.log(data); // Handle server response
    // Handle the response based on its type
    if (data.type === 'signup') {
      if (data.message === 'Successful') {
        // Do something when login is successful, such as redirecting the user
        const username = data.content.username;
        const fullname = data.content.name;
        const isTrainer = data.content._isTrainer;
        APP.IAmTrainer = isTrainer;
        APP.setUser(username,fullname);
        main_page();
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
    if (data.type === 'login') {
      if (data.message === 'Successful') {
        const username = data.content.username;
        const fullname = data.content.name;
        const isTrainer = data.content._isTrainer;
        APP.IAmTrainer = isTrainer;
        APP.setUser(username,fullname);
        main_page();
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
      //console.log("Enrollment dict for user " + username + ": "+ JSON.stringify(data.content));
      APP.my_user.enrolledClasses = data.content;
    } else {
      console.log("Couldn't retrieve enrolled classes");
    }
  }
}
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

  // TESTS 
//signup("rosa", "asdf");
//const trainer = new Trainer("Ro", "ro");
//const class_offer = trainer.createClass("Zumba", "A very easy zumba class", "10 AM", "2h");
//console.log(JSON.stringify(class_offer));
//sendClass(class_offer);
//signup("new", "Rosaro77", true, "Rosa Alos");
//sendEnrollment("ma", "26");
askForEnrolledClasses("ma");
//sendEnrollment("ma", "27");