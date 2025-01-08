/**
 * 
 * 
 * This file will control the schedule page (schedule.html) 
 * 1. Ensure that a teacher is logged in and choosed a class by checking the value 
 *    of the variable (loggedin_teacher, class) from the browser storage.
 *    If the loggedin_teacher is null, it will redirect the user to start page (index.html).
 *    Else if class is null, it will redirect the user to account page (account.html). 
 * 
 * 
 * 2. After the documet content loaded,
 *    the class and logged in teacher will be fetched from storage file,
 *    the schedule settings will be raed from settings.json file 
 *    and the schedule time slots and days will be displayed in the schedule section on the schedule page.
 * 
 * 3. After reading the schedule settings 
 *    the slot will be checked to macke sure if its allowed to reserve or not
 * 
 * 4. Add event listener to Select time slots button, 
 *    when the user clicked on a time slot, it will be reserved or released
 * 
 * 5. Add event listener to Save Modifications button, 
 *    when the user clicked on Save Modifications button,
 *    all modifications will be checked,
 *    if the modifications are allowed, then a success message will be displayed on schedule page
 *    else a failed message will be displayed with all overlapped reservations. 
 * 
 * 
 * 6. Add event listener to logout button
 *    when logout button clicked then the user will be
 *    redirected to start page and the (loggedin_teacher, class) items will be removed from storage
 * 
 */


/**
 * call function (loginCheck), which is declared in helper.js file 
 * before fetching the classes data.
 * If the loggedin_teacher is null, it will redirect the user to start page. 
 */
window.onload = function () {
    //call loginAndClassCheck function with loggedin_teacher parameter to check the teacher and class in browser storage
    loginAndClassCheck(["loggedin_teacher", "class"], function (isLoggedIn, isClassChosen) {
        if (!isLoggedIn) {
            redirect('index.html');
        } else if (!isClassChosen) {
            redirect('account.html');
        }
    });
}

/**
 * After the documet conetnt loaded, schedule settings and reservations will be fetched and displayed.
 * After finishing loading the data, the event listener on selcting time slots will be added.
 * and an event listener on logout button will be added 
 */

document.addEventListener("DOMContentLoaded", function () {
    // Enable tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // add event listener to logout button 
    addEventListenerlogoutButton();

    /**
     * event listener to logout button
     */
    function addEventListenerlogoutButton() {
        let logoutButton = document.getElementById("logout");
        logoutButton.addEventListener("click", function () {
            //logout is declared in helper.js file
            logout(redirect, 'index.html');
        });
    }


    // fetch data from reservations.json files then fill time slots section on schedule page
    fetchData();

    /**
     * Fetchig reservations data. 
     * Get the logged in teacher object according to the loggedin_teacher key, which is saved in browser storage according to the class key
     * Get the chosen class object according to the class, which is saved in browser storage.
     * Display class name on the header of schedule page
     * call fetchReservations function to get the reservations
     */
    function fetchData() {

        //  get logged in teacher from browse storage
        const loggedinTeacher = getItemFromStorage('loggedin_teacher');
        displayTeacherName(loggedinTeacher);
        if (loggedinTeacher) {
            //  get chosenClass from browse storage
            const chosenClass = getItemFromStorage('class');
            // display teacher name on the header of schedule page
            displayClassName(chosenClass);
            if (chosenClass) {
                // call fetchClasses function to fetch reservations from json file
                // fetchClasses(loggedinTeacher);
            } else {
                hideLoader();
                throw `cannot find the chosen class`;
            }
        } else {
            hideLoader();
            throw `cannot find the logged in teacher`;
        }
    }



    /*
     * display teacher name on the header of schedule page
     */
    function displayTeacherName(teacher) {
        let teacherNameElement = document.getElementById("teacher-name");
        let displayedText = "Teacher not found";
        if (teacher) {
            displayedText = teacher.username;
        }
        teacherNameElement.innerText = displayedText;
    }

    /*
     * display class name on the header of schedule page
     */
    function displayClassName(chosenClass) {
        let classNameElement = document.getElementById("class-name");
        let displayedText = "class not found";
        if (chosenClass) {
            displayedText = chosenClass.name;
        }
        classNameElement.innerText = displayedText;
    }


});