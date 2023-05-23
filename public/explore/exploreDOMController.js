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

function showDetail(id, type) {
    const class_detail_div = document.querySelector('.class-detail');
    const mainElement = document.querySelector('.main');

    class_detail_div.style.display = null;
    mainElement.style.display = 'none';
    APP.class_in_detail = id;
    //TODO show class

    //const class_object = APP.recommendations[id];
    const description = "As a language model, I've been trained on vast amounts of text data, allowing me to generate natural - sounding responses to a wide range of prompts.Whether you're looking for information, advice, or just a friendly chat, I'm here to help.From philosophy to technology, history to pop culture, I can engage in conversations on almost any topic.So don't hesitate to ask me a question or strike up a conversation.I'm always ready to learn and grow, just like the humans who created me.";
    const class_object = new Class('title', description, 'datetime', '20 min', 'user', 'advanced', 10, 20);
    displayClassOffer(id, class_object.title, class_object.creator, class_object.datetime, class_object.description, class_object.duration, class_object.price, true, type);


}


function showPaymentForm() {
    const class_detail_div = document.querySelector('.class-detail');
    const paymentForm = document.getElementById('payment-form');

    class_detail_div.style.display = 'none';
    paymentForm.style.display = null;
}