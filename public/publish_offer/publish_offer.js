function submitForm(){
    // Get all input values
    const titleValue = document.getElementById('title').value;
    const descriptionValue = document.getElementById('description').value;
    const dateTimeValue = document.getElementById('dateTime').value;
    const durationValue = parseInt(document.getElementById('duration').value);
    const levelValue = document.getElementById('level').value;
    const priceValue = parseInt(document.getElementById('price').value);
    const maxUsersValue = parseInt(document.getElementById('maxUsers').value);
    //Create class
    const my_user = APP.my_user;
    const class_object = my_user.createClass(titleValue, descriptionValue, dateTimeValue, durationValue, levelValue, priceValue, maxUsersValue);
    // Send class to server
    const id = sendClass(class_object);
    class_object.id = id;
    my_user.saveClass(id, class_object);
    goToPage(PAGES.MAIN);
}

function cancelForm() {
    goToPage(PAGES.MAIN);
}