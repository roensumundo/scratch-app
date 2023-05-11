function displayClassOffer(id, classname, creator, datetime, description, duration, price, detail, type) {
    // create the outer div with class "class_offer" and id "class_offer_1"
    const classOfferDiv = document.createElement('div');
    classOfferDiv.className = 'class_offer';
    classOfferDiv.id = 'class_offer_' +id ;
  
    // create the div with class "offer-small-text" and inner p element
    const smallTextDiv = document.createElement('div');
    smallTextDiv.className = 'offer-small-text';
    const smallTextP = document.createElement('p');
    if (type == 'recommendation'){
        smallTextP.innerText = price + '€';
    } else {
        // TODO: Calculate time left and only show when a threshold is reached
        smallTextP.innerText = 'Starts in 5 min';
        smallTextDiv.appendChild(smallTextP);
    }
    
  
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
    // Cut description in limited characters in the non-detailed version of the class offer
    if (!detail) description.substring(0, 255);
    descriptionP.innerText = description + "...";
    descriptionDiv.appendChild(descriptionP);

    //Add price information
  
    // append all child elements to the "offer-content" div
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(subtitleP);
    contentDiv.appendChild(button);
    contentDiv.appendChild(descriptionDiv);
  
    // append the "offer-small-text" and "offer-content" divs to the "class_offer" div
    classOfferDiv.appendChild(smallTextDiv);
    classOfferDiv.appendChild(contentDiv);
    
    if (detail) {
        const class_detail = document.querySelector(".class-detail");
        class_detail.appendChild(classOfferDiv);
    } else {
        // select element with class "upcoming-classes" and append class offer div
        const upcomingClasses = document.querySelector(".upcomming-classes");
        upcomingClasses.appendChild(classOfferDiv);
    }
    
}

function runMain() {
    //Loads client information from browser's local storage 
    const my_user = APP.my_user;
    
    addNameToMenu(my_user.name, my_user.username);
    // Remove the link to publish-offer from the menu. 
    if (!APP.IAmTrainer) {
        const button = document.querySelector('.publish-offer');
        button.remove();
    }
    askForEnrolledClasses(APP.my_user.username).then(() => {
        //Displays enrolled classes information
        const enrolledClasses = APP.my_user.enrolledClasses;
        for (const class_id in enrolledClasses) {
            let class_object = enrolledClasses[class_id];
            //TODO include duration in displayClassOffer function
            displayClassOffer(class_id, class_object.title, class_object.creator, class_object.datetime, class_object.description, class_object.duration, class_object.price, false, 'enrolled');
        }
    })
     
}
function returnToMain() {
    const class_detail_div = document.querySelector('.class-detail');
    const mainElement = document.querySelector('main');

    class_detail_div.style.display = 'none';
    mainElement.style.display = null;
}
  
function showDetail(id) {
    const class_detail_div = document.querySelector('.class-detail');
    const mainElement = document.querySelector('main');

    class_detail_div.style.display = null;
    mainElement.style.display = 'none';

    //TODO show class

    askForClassInfo(id)
        .then((class_obj) => {
            
        })



}
  
