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