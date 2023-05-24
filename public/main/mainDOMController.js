

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
    const mainElement = document.querySelector('.main');

    class_detail_div.style.display = 'none';
    mainElement.style.display = null;
}
  



  
function showDetail(id) {
    const class_detail_div = document.querySelector('.class-detail');
    const mainElement = document.querySelector('.main');

    class_detail_div.style.display = null;
    mainElement.style.display = 'none';
    APP.class_in_detail = id;
    //TODO show class

    //const class_object = APP.recommendations[id];
    const description = "Welcome to Rhythm Fusion, a sizzling and infectious dance fitness experience that will transport you to the heart of a tropical party! Our Zumba class is a high-energy, calorie-burning extravaganza that combines Latin rhythms, easy-to-follow choreography, and non-stop fun, leaving you feeling exhilarated and ready to conquer the dance floor. \n\n As soon as the music starts, you wil feel the electrifying beats pulsating through your body, awakening your senses and setting the stage for an unforgettable journey. Our expert instructors will guide you through a fusion of Latin-inspired dance movements, easy-to-follow choreography, and exhilarating cardio exercises, creating a dynamic and engaging atmosphere that will leave you breathless and craving more."
    const datetime = new Date('2023', '6', '10', '19', '0');
    const formattedDate = datetime.toLocaleString('en-US', options);
    const class_object = new Class('Rhythm Fusion', 'Zumba',description, formattedDate, '1 h', 'supertrainer', 'Advanced', 5,20);
    displayClassOffer(id, class_object.title, class_object.category, class_object.level, class_object.maxUsers, class_object.creator, formattedDate, class_object.description, class_object.duration, class_object.price, true, 'recommendation');
    //displayClassOffer(id, class_object.title, class_object.category, class_object.level, class_object.maxUsers, class_object.creator, class_object.datetime, class_object.description, class_object.duration, class_object.price, true, 'recommendation' )

}


function showPaymentForm() {
    const class_detail_div = document.querySelector('.class-detail');
    const paymentForm = document.getElementById('payment-form');

    class_detail_div.style.display = 'none';
    paymentForm.style.display = null;
}