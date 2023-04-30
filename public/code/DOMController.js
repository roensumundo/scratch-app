function displayClassOffer(id, classname, creator, datetime, description, duration) {
    // create the outer div with class "class_offer" and id "class_offer_1"
    const classOfferDiv = document.createElement('div');
    classOfferDiv.className = 'class_offer';
    classOfferDiv.id = 'class_offer_' +id ;
  
    // create the div with class "offer-small-text" and inner p element
    const smallTextDiv = document.createElement('div');
    smallTextDiv.className = 'offer-small-text';
    const smallTextP = document.createElement('p');
    smallTextP.innerText = 'Starts in 5 min';
    smallTextDiv.appendChild(smallTextP);
  
    // create the div with class "offer-content" and its child elements
    const contentDiv = document.createElement('div');
    contentDiv.className = 'offer-content';
  
    const titleDiv = document.createElement('div');
    titleDiv.className = 'offer-title';
    const titleH2 = document.createElement('h2');
    titleH2.innerText = classname
    const titleP = document.createElement('p');
    titleP.className = 'username-offer';
    titleP.innerText = '@' + creator;
    titleDiv.appendChild(titleH2);
    titleDiv.appendChild(titleP);
  
    const subtitleP = document.createElement('p');
    subtitleP.className = 'date-time';
    subtitleP.innerText = datetime + "-" + duration;
  
    const button = document.createElement('button');
    button.className = 'go-button';
    button.innerText = 'Go';
  
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'offer-description';
    const descriptionP = document.createElement('p');
    descriptionP.innerText = description;
    descriptionDiv.appendChild(descriptionP);
  
    // append all child elements to the "offer-content" div
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(subtitleP);
    contentDiv.appendChild(button);
    contentDiv.appendChild(descriptionDiv);
  
    // append the "offer-small-text" and "offer-content" divs to the "class_offer" div
    classOfferDiv.appendChild(smallTextDiv);
    classOfferDiv.appendChild(contentDiv);
  
    // select element with class "upcoming-classes" and append class offer div
    const upcomingClasses = document.querySelector(".upcomming-classes");
    upcomingClasses.appendChild(classOfferDiv);
}
  
function explore_switcher(){
    const recommendedButton = document.getElementById('recommended-button');
    const subscribedToButton = document.getElementById('subscribed-to-button');

    recommendedButton.addEventListener('click', () => {
        recommendedButton.classList.add('active');
        subscribedToButton.classList.remove('active');
    });

    subscribedToButton.addEventListener('click', () => {
        subscribedToButton.classList.add('active');
        recommendedButton.classList.remove('active');
        });
}

function submitLogin() {
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;
    //console.log("password: " +password + ", encripted "+Buffer.from(password, 'base64'));
    login(username, password);
    
}

function continueSignUp() {
    var fullname = document.getElementById('signup-fullname').value;
    var username = document.getElementById('signup-username').value;
    var password = document.getElementById('signup-password').value;
    var repeated_password = document.getElementById('signup-rep-password').value;
    const regex = /(?=.*\d)(?=.*[A-Z])/;

    //TODO Make the password to be greater than 12 characters. 
    if (username == null) {
        //TODO change it by text in DOM
        alert("Username is required");
        return;
    }
    else if (fullname == null) {
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
