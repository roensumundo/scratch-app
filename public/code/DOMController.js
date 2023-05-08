
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