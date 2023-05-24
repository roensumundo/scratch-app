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

function showRecommendations() {
    const recommendationsDiv = document.querySelector('.recommendations');
    const subscriptionsDiv = document.querySelector('.subscribed-classes');

    subscriptionsDiv.style.display = 'none';
    recommendationsDiv.style.display = null;
}

function showSubscribed() {
    const recommendationsDiv = document.querySelector('.recommendations');
    const subscriptionsDiv = document.querySelector('.subscribed-classes');

    subscriptionsDiv.style.display = null;
    recommendationsDiv.style.display = 'none';
    
}

function showDetail(id, type) {
    const class_detail_div = document.querySelector('.class-detail');
    const mainElement = document.querySelector('.main');

    class_detail_div.style.display = null;
    mainElement.style.display = 'none';
    APP.class_in_detail = id;
    //TODO show class

    //const class_object = APP.recommendations[id];
    const description = "Join us for a soothing and rejuvenating Gentle Flow Yoga class. This practice focuses on gentle movements, deep breathing, and mindfulness. Suitable for all levels, it promotes flexibility, stress relief, and inner balance. Discover the harmony of body and mind in a serene and welcoming environment.\n \n In our Gentle Flow Yoga class, you'll have the opportunity to unwind and find solace from the demands of daily life. As you step into the tranquil space, you'll be greeted by soft lighting, calming music, and a serene ambiance that creates a sense of relaxation and peace. The atmosphere itself is designed to help you release any tension and enter a state of tranquility, setting the stage for a transformative yoga experience.\n\n Throughout the class, our experienced instructor will guide you through a series of gentle movements and poses. Each movement is carefully designed to allow your body to flow gracefully from one posture to another, encouraging a sense of fluidity and ease. Whether you're a beginner or an experienced yogi, the instructor will provide modifications and variations to ensure that the practice is accessible and beneficial for all participants."
    const datetime = new Date('2023', '6', '10', '17', '30');
    const formattedDate = datetime.toLocaleString('en-US', options);
    const class_object = new Class('Gentle Flow Yoga', 'Yoga', description, formattedDate, '1 h', 'yogawithme', 'Begginers', 10,15);
    displayClassOffer(id, class_object.title, class_object.category, class_object.level, class_object.maxUsers, class_object.creator, formattedDate, class_object.description, class_object.duration, class_object.price, true, 'subscription');

}


function showPaymentForm() {
    const class_detail_div = document.querySelector('.class-detail');
    const paymentForm = document.getElementById('payment-form');

    class_detail_div.style.display = 'none';
    paymentForm.style.display = null;
}

function returnToExplore() {
    const class_detail_div = document.querySelector('.class-detail');
    const mainElement = document.querySelector('.main');

    class_detail_div.style.display = 'none';
    mainElement.style.display = null;
}