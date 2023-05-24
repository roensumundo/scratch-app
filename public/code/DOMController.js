
function displayMenu() {
    const menuContainer = document.querySelector('.menu-container');
    if (menuContainer.style.display === 'none') {
        menuContainer.style.display = 'block';
    } else {
        menuContainer.style.display = 'none';
    }
}
function addNameToMenu(fullname, username) {
    const nameMenu = document.querySelector('.name')
    const usernameMenu = document.querySelector('.username')
    nameMenu.innerHTML = fullname;
    usernameMenu.innerHTML = "@" + username;
}

function enrollToClass() {
    const user = APP.my_user;
    const username = user.username;
    const class_id = APP.class_in_detail;
    sendEnrollment(username, class_id);
    goToPage(PAGES.MAIN);

}

function askForRating() {
    const ratingBox = document.querySelector(".rating-box");
    ratingBox.style.display = 'flex';
    ratingBox.style.flexDirection = 'column';
}

function addClassInfo(category, level, maxUsers) {
    // Create the <div> element
    var classInfoDiv = document.createElement('div');
    classInfoDiv.className = 'class-info';
  
    // Create the <p> element for category
    var categoryP = document.createElement('p');
    categoryP.className = 'category';
    categoryP.textContent = '- ' + category + ' -';
    classInfoDiv.appendChild(categoryP);
  
    // Create the <p> element for level
    var levelP = document.createElement('p');
    levelP.className = 'level';
    levelP.textContent = '- ' + level + ' -';
    classInfoDiv.appendChild(levelP);
  
    // Create the <p> element for maxUsers
    var maxUsersP = document.createElement('p');
    maxUsersP.className = 'maxUsers';
    maxUsersP.textContent = '- Max. Users: ' + maxUsers + ' -';
    classInfoDiv.appendChild(maxUsersP);
  
    return classInfoDiv;
  }

function displayClassOffer(id, classname, category, level, maxUsers, creator, datetime, description, duration, price, detail, type) {
    // create the outer div with class "class_offer" and id "class_offer_1"
    const classOfferDiv = document.createElement('div');
    let div_class_name = 'class_offer';
    classOfferDiv.className = div_class_name;
    if (detail) {
        div_class_name += '_detail'
    }
    classOfferDiv.id = div_class_name + '_' +id ;
  
    // create the div with class "offer-small-text" and inner p element
    const smallTextDiv = document.createElement('div');
    smallTextDiv.className = 'offer-small-text';
    const smallTextP = document.createElement('p');
    if (type == 'recommendation'){
        smallTextP.innerText = price + ' €';
        smallTextP.className = 'price';
        classOfferDiv.className += ' recommended';
        
    } else if (type == 'subscription') {
        smallTextP.innerText = price + ' €';
        smallTextP.className = 'price';
        classOfferDiv.className += ' subscribed';
    }
    else {
        // TODO: Calculate time left and only show when a threshold is reached
        
        smallTextP.innerText = 'Starts in 5 min';
        smallTextP.className = 'alert'
    }
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
    if (type == 'recommendation' || type == 'subscription') {
        if (detail) {
            button.innerText = 'Book';
            button.onclick = showPaymentForm;
        } else {
            button.innerText = 'View details';
        }
        
    } else {
        button.innerText = 'Go';
    }
    
  
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'offer-description';
    const descriptionP = document.createElement('p');

    const class_info = addClassInfo(category, level, maxUsers)
    // Cut description in limited characters in the non-detailed version of the class offer
    if (!detail) description.substring(0, 255);
    descriptionP.innerText = description + "...";
    descriptionDiv.appendChild(descriptionP);

    //Add price information
  
    // append all child elements to the "offer-content" div
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(subtitleP);
    contentDiv.appendChild(button);
    contentDiv.appendChild(class_info);
    contentDiv.appendChild(descriptionDiv);
  
    // append the "offer-small-text" and "offer-content" divs to the "class_offer" div
    classOfferDiv.appendChild(smallTextDiv);
    classOfferDiv.appendChild(contentDiv);
    
    if (detail) {
        const class_detail = document.querySelector(".class-detail");
        class_detail.appendChild(classOfferDiv);
    } else if (type == 'recommendation') {
        const recommendations = document.querySelector(".recommendations");
        recommendations.appendChild(classOfferDiv);
    }
    else if (type=='subscription') {
        const subscriptions = document.querySelector(".subscribed-classes");
        subscriptions.appendChild(classOfferDiv);
    }
    else{
        // select element with class "upcoming-classes" and append class offer div
        const upcomingClasses = document.querySelector(".upcomming-classes");
        upcomingClasses.appendChild(classOfferDiv);
    }
    
}

