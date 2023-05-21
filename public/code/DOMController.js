
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