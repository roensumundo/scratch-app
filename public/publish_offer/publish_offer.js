function submitForm(){
    // Get all input values
    const titleValue = document.getElementById('title').value;
    const categoryValue = document.getElementById('category_selection').value;
    const descriptionValue = document.getElementById('description').value;
    const dateTimeValue = document.getElementById('dateTime').value;
    const durationValue_h = parseInt(document.getElementById('duration_h').value);
    const durationValue_min = parseInt(document.getElementById('duration_min').value);
    const durationValue = durationValue_h + ' h' + durationValue_min + ' min';
    const levelValue = document.getElementById('level').value;
    const priceValue = parseInt(document.getElementById('price').value);
    const maxUsersValue = parseInt(document.getElementById('maxUsers').value);
    //Create class
    const my_user = APP.my_user;
    const class_object = my_user.createClass(titleValue, categoryValue, descriptionValue, dateTimeValue, durationValue, levelValue, priceValue, maxUsersValue);
    // Send class to server
    sendClass(class_object).then((id) => {
        class_object.id = id;
        my_user.saveClass(id, class_object);
        goToPage(PAGES.MAIN);
    });
    
}

function cancelForm() {
    goToPage(PAGES.MAIN);
}