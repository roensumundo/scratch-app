function displayClassOffer(id, classname, creator, datetime, description, duration, price, detail, type) {
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
        smallTextP.innerText = price + '€';
        smallTextDiv.className += ' price';
        classOfferDiv.className += ' recommended';
        
    } else {
        // TODO: Calculate time left and only show when a threshold is reached
        
        smallTextP.innerText = 'Starts in 5 min';
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
    if (type == 'recommendation') {
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
    /*
    askForEnrolledClasses(APP.my_user.username).then(() => {
        //Displays enrolled classes information
        const enrolledClasses = APP.my_user.enrolledClasses;
        for (const class_id in enrolledClasses) {
            let class_object = enrolledClasses[class_id];
            //TODO include duration in displayClassOffer function
            displayClassOffer(class_id, class_object.title, class_object.creator, class_object.datetime, class_object.description, class_object.duration, class_object.price, false, 'enrolled');
        }
    })
    */
     
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
    APP.class_in_detail = id;
    //TODO show class

    //const class_object = APP.recommendations[id];
    const description = "As a language model, I've been trained on vast amounts of text data, allowing me to generate natural - sounding responses to a wide range of prompts.Whether you're looking for information, advice, or just a friendly chat, I'm here to help.From philosophy to technology, history to pop culture, I can engage in conversations on almost any topic.So don't hesitate to ask me a question or strike up a conversation.I'm always ready to learn and grow, just like the humans who created me.";
    const class_object = new Class('title', description, 'datetime', '20 min', 'user', 'advanced', 10, 20);
    displayClassOffer(id, class_object.title, class_object.creator, class_object.datetime, class_object.description, class_object.duration, class_object.price, true, 'recommendation');


}

function showPaymentForm() {
    const class_detail_div = document.querySelector('.class-detail');
    const paymentForm = document.getElementById('payment-form');

    class_detail_div.style.display = 'none';
    paymentForm.style.display = null;
}

  
