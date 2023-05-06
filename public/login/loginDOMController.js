function submitLogin() {
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;
    //console.log("password: " +password + ", encripted "+Buffer.from(password, 'base64'));
    if (!username.trim()) {
        //TODO change it by text in DOM
        alert("Username is required");
        return;
    }
    login(username, password);
    
}

function continueSignUp() {
    var fullname = document.getElementById('signup-fullname').value;
    var username = document.getElementById('signup-username').value;
    var password = document.getElementById('signup-password').value;
    var repeated_password = document.getElementById('signup-rep-password').value;
    const regex = /(?=.*\d)(?=.*[A-Z])/;

    //TODO Make the password to be greater than 12 characters. 
    console.log("username= " + username);
    console.log("fullname= " + fullname);
    if (!username.trim()) {
        //TODO change it by text in DOM
        alert("Username is required");
        return;
    }
    else if (!fullname.trim()) {
        //TODO change it by text in DOM
        alert("Full name is required");
        return;
    }
    else if (!regex.test(password)) {
        //TODO change it by text in DOM
        alert("Password must contain at least one uppercase letter and one digit.");
        return;
    }
    else if (password !== repeated_password) {
         //TODO change it by text in DOM
        alert("Passwords do not match");
        return;
    }

    const signUpForm1 = document.getElementById("signup-form");
    const signUpForm2 = document.getElementById("signup-form-2");
    signUpForm1.style.display = 'none';
    signUpForm2.style.display = null;

}
function submitSignUp() {

    const birthdateString = document.getElementById('birthdate').value;
    const gender = document.getElementById('gender').value;
    const location = document.getElementById('location').value;

    if (birthdateString == null) {
        //TODO change it by text in DOM
        alert("Birthday is required");
        return;
    }
    else if (gender == null) {
        //TODO change it by text in DOM
        alert("Gender is required");
        return;
    }
    else if (location == null) {
        //TODO change it by text in DOM
        alert("Location is required");
        return;
    }


    let birthdate = new Date(birthdateString);
    // Calculate the difference between the birthdate and the current date
    let ageDifference = Date.now() - birthdate.getTime();
    // Convert the difference to years
    let ageDate = new Date(ageDifference);
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);

    var fullname = document.getElementById('signup-fullname').value;
    var username = document.getElementById('signup-username').value;
    var password = document.getElementById('signup-password').value;
    // Send the sign-up message to the server
    signup(username, password, APP.IAmTrainer, fullname, age, location, gender);
}

function isTrainer(response) {
    // Manage trainer-choice screen. Saves the option picked by the user on whether it is a trainer.
    APP.IAmTrainer = response;
    const signUpForm = document.getElementById('signup-form');
    const trainerChoiceForm = document.getElementById('trainer-choice-form');
    
    signUpForm.style.display = null;
    trainerChoiceForm.style.display = 'none';

}
function showSignUpForm() { 
    const trainerChoiceForm = document.getElementById('trainer-choice-form');
    const loginForm = document.getElementById('login-form');
    trainerChoiceForm.style.display = null;
    loginForm.style.display = 'none';

}
