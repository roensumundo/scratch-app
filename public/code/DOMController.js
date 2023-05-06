
function displayMenu() {
    const menuContainer = document.querySelector('.menu-container');
    if (menuContainer.style.display === 'none') {
        menuContainer.style.display = 'block';
    } else {
        menuContainer.style.display = 'none';
    }
}