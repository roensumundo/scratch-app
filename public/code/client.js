
// For sign-up request
const signup = async (username, password) => {
    const response = await fetch('http://localhost:9026/signup', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    console.log(data); // Handle server response
    // Handle the response based on its type
    if (data.type === 'signup') {
      if (data.message === 'Successful') {
        // Do something when login is successful, such as redirecting the user
        main_page();
      } else {
        // Display an error message to the user
        alert(data.message);
      }
    }
  };
  
  // For login request
  const login = async (username, password) => {
    const response = await fetch('http://localhost:9026/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    console.log(data); // Handle server response
    // Handle the response based on its type
    if (data.type === 'login') {
      if (data.message === 'Successful') {
        // Do something when login is successful, such as redirecting the user
        main_page();
      } else {
        // Display an error message to the user
        alert(data.message);
      }
    }
  };

const sendClass = async (class_object) => {
  const response = await fetch('http://localhost:9026/publish_class', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(class_object)
  });
  const data = await response.json();
  if (data.type === 'saved_class') {
    if (data.message === 'Successful') {
      //APP.my_user.createClass(data.id, class_object);
      console.log('Class Successfully created');
    }
    else {
      console.log("Class not published properly");
    }
  }
  

}
  // For main page request 
  const main_page = async () => {
    const response = await fetch('http://localhost:9026/main');
    const html = await response.text(); // get the response as text
    document.documentElement.innerHTML = html;
  };


  // TESTS 
//signup("rosa", "asdf");
const trainer = new Trainer("Ro", "roensumundo");
const class_offer = trainer.createClass("Yoga", "A very easy yoga class", "9 AM", "2h");
console.log(JSON.stringify(class_offer));
sendClass(class_offer);