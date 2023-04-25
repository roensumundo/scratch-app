function displayClassOffer(id, classname, creator, datetime, description) {
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
    titleP.className = 'username';
    titleP.innerText = '@' + creator;
    titleDiv.appendChild(titleH2);
    titleDiv.appendChild(titleP);
  
    const subtitleP = document.createElement('p');
    subtitleP.className = 'date-time';
    subtitleP.innerText = datetime;
  
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
function submitSignUp() {
    var username = document.getElementById('signup-username').value;
    var password = document.getElementById('signup-password').value;
    var repeated_password = document.getElementById('signup-rep-password').value;
    //console.log("password: " +password + ", encripted "+Buffer.from(password, 'base64'));
    const regex = /(?=.*\d)(?=.*[A-Z])/;

    if (!regex.test(password)) {
        alert("Password must contain at least one uppercase letter and one digit.");
        return;
    }
    else if (password = !repeated_password) {
        alert("Passwords do not match");
        return;
    }
    signup(username, password, APP.IAmTrainer, APP.myFullName);
}

function isTrainer(response) {
    //TODO: Manage button choice and let the server know which kind of user it would be
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
