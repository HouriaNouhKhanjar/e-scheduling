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
    loginAndClassCheck(function (isLoggedIn, isClassChosen) {
        if (!isLoggedIn) {
            redirect(CONFIG.START_PAGE);
        } else if (!isClassChosen) {
            redirect(CONFIG.ACCOUNT_PAGE);
        }
    });
}

/**
 * After the documet conetnt loaded, schedule settings and reservations will be fetched and displayed.
 * After finishing loading the data, the event listener on selcting time slots will be added.
 * and an event listener on logout button will be added 
 */

document.addEventListener("DOMContentLoaded", function () {

    // Enable tooltips to display conditions rule on schedule header
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));



    // add event listener to logout button 
    addEventListenerlogoutButton();

    /**
     * event listener to logout button
     */
    function addEventListenerlogoutButton() {
        let logoutButton = document.getElementById(CONFIG.LOGOUT);
        logoutButton.addEventListener("click", function () {
            //logout is declared in helper.js file
            logout(CONFIG.START_PAGE);
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
        const loggedinTeacher = getItemFromStorage(CONFIG.LOGGED_IN_TEACHER);
        displayTeacherName(loggedinTeacher);
        if (loggedinTeacher) {
            //  get chosenClass from browse storage
            const chosenClass = getItemFromStorage(CONFIG.CHOSEN_CLASS);
            // display teacher name on the header of schedule page
            displayClassName(chosenClass);
            if (chosenClass) {
                //  get settings and reservations from browse storage
                let settings = getItemFromStorage(CONFIG.SETTINGS);
                let reservations = getItemFromStorage(CONFIG.RESERVATIONS);

                // filter reservations to get teacher reservations, class reservtions,
                // and loggedin teacher with chosen class reservation
                let filteredReservations = filterReservations(loggedinTeacher, chosenClass, reservations, true);
                // fill  time slots
                fillTimeSlotsTable(loggedinTeacher, chosenClass, filteredReservations, settings);

            } else {
                hideLoader();
                throw `cannot find the chosen class`;
            }
        } else {
            hideLoader();
            throw `cannot find the logged in teacher`;
        }
    }

    /**
     * Fill time slots table on schedule page
     */
    function fillTimeSlotsTable(loggedinTeacher, chosenClass, reservations, settings) {
        if (reservations && reservations.teacherClassReservation) {
            // Get the reservation related for teacher and class
            const teacherClassReservation = reservations.teacherClassReservation;
            // display lessons count
            displayLessonsCount(teacherClassReservation);
            if (settings && settings[CONFIG.DAYS] && settings[CONFIG.TIME_SLOTS]) {
                let reservationsList = document.querySelector(`#${CONFIG.RESERVATIONS_LIST}`);
                // create container elemnt for reservation section
                const containerElement = createReservationContainerElement(reservations, settings,
                    teacherClassReservation[CONFIG.TEACHER_ID], teacherClassReservation[CONFIG.CLASS_ID]);

                reservationsList.appendChild(containerElement);

                //  add save modifications button
                let saveButton = addSaveModificationsButton();
                reservationsList.appendChild(saveButton);


                // call hideLoader function, which is declared in helper.js file to hide the loader after displaying data 
                hideLoader();

                // add event listener to select a time slot
                addEventListenerToTimeSlot();

                // add event listener to click on the save modifications button
                addEventListenerToSaveButton(loggedinTeacher, chosenClass, settings, reservations);

            } else {
                displayReservationsNotFound();
            }
        } else {
            displayReservationsNotFound();
        }
    }

    /**
     * Create reservation container elment
     */
    function createReservationContainerElement(reservations, settings, teacher, classObj) {

        // create the container element
        let containerElement = document.createElement("div");
        containerElement.classList.add("col-12");

        // acreate the row element, the parent for days and time slots
        let rowElement = document.createElement("div");
        rowElement.classList.add("row", "time-slots-table");

        // add time slots element on large devices
        rowElement.innerHTML = `<div class="times col-lg-2 d-none d-lg-block">
                                            <div class="time">Times</div>
                                             ${createTimesHtml(settings)}
                                        </div>`;


        //create days element  and add it to the row element
        createDaysHtml(rowElement, settings, reservations, teacher, classObj);

        //add the row element which containes the times and days to container element
        containerElement.appendChild(rowElement);
        return containerElement;
    }

    /**
     * create the Html element  to display the days on reservations section on schedule page
     */
    function createDaysHtml(rowElement, settings, reservations, teacher, classObj) {

        // for each day display the day name, the time slots in small devices, and the slot related to day and time slot
        for (let day of settings[CONFIG.DAYS]) {
            // display day name
            let dayElement = document.createElement("div");
            dayElement.classList.add("col-12", "col-lg-2", "day");
            dayElement.innerHTML = `<div class="day-name">${day}</div>`;

            // display time slots element in small devices
            let timesElement = document.createElement("div");
            timesElement.classList.add("d-flex");
            timesElement.innerHTML = `<div class="d-lg-none">
                        ${createTimesHtml(settings)}
                    </div>`;

            // display  a clickable slot element related to day, time, teacher, class 
            // for each slot declared in settings
            let timeSlotsElement = document.createElement("div");
            timeSlotsElement.classList.add("time-slots", "flex-grow-1");
            let timeSlotsHtml = "";
            for (let time of settings[CONFIG.TIME_SLOTS]) {
                // Check the slot if it is already selected from the teacher him self or from other teacher
                // or if it selected from the teacher himself for another class 
                const slotType = getSlotType(reservations, day, time);

                timeSlotsHtml += `<div class="slot ${slotType.classes}" data-day="${day}" data-time-slot="${time}" 
                                       data-teacher="${teacher}" 
                                       data-class="${classObj}">
                                          ${slotType.message}
                                   </div>`
            }
            timeSlotsElement.innerHTML = timeSlotsHtml;

            // add slot elements to time slots section on day element
            timesElement.appendChild(timeSlotsElement);
            // add time slots element to day element
            dayElement.appendChild(timesElement);

            //add the day element to row element
            rowElement.appendChild(dayElement);
        }

    }

    /**
     * 
     * create times HTML element to display on the reservations section on schedule page
     */
    function createTimesHtml(settings) {
        // get all time slots from settings and display them
        let timeSlots = "";
        settings[CONFIG.TIME_SLOTS].every((time) => timeSlots += `<div class="time">${time}</div>`);
        return timeSlots;
    }


    /** 
     * Check the slot if it is already selected from the teacher him self or from other teacher
     *  or if it selected from the teacher himself for another class 
     */
    function getSlotType(reservations, day, time) {

        // if no conditions met
        //then the slot is active and the user can select the slot
        let classList = "slot-active";
        let message = "";
        let count = 0;

        // check if the slot is selected from other teachers
        const selectedFromTeacher = reservations.classReservations.filter((res) =>
            res[CONFIG.TIMES_SLOTS] && res[CONFIG.TIMES_SLOTS][day] &&
            res[CONFIG.TIMES_SLOTS][day].length && res[CONFIG.TIMES_SLOTS][day].includes(time)
        );
        // check if the slot is selected for another class
        const selectedForClass = reservations.teacherReservations.filter((res) =>
            res[CONFIG.TIMES_SLOTS] && res[CONFIG.TIMES_SLOTS][day] &&
            res[CONFIG.TIMES_SLOTS][day].length && res[CONFIG.TIMES_SLOTS][day].includes(time)
        );

        // check if the slot is selected for this class from the teacher himself
        const timeSlotes = reservations.teacherClassReservation[CONFIG.TIMES_SLOTS];
        const selectedFromTeacherClass = timeSlotes && timeSlotes[day] && timeSlotes[day].length ?
            timeSlotes[day].includes(time) : null;

        if (selectedFromTeacher && selectedFromTeacher.length) {
            classList = "slot-disabled";
            message = "Reserved by another teacher";
            count++;
        }
        if (selectedForClass && selectedForClass.length) {
            classList = "slot-disabled";
            message += " \n Reserved for another class";
            count++;
        }
        if (selectedFromTeacherClass) {
            classList = `slot-active ${CONFIG.SELECTED}`;
            message = "click to remove selection";
            count++;
        }

        // if no condition is met then the user can select the slot
        if (count === 0) {
            message = "click to select";
        }

        return {
            "classes": classList,
            "message": message
        };
    }

    /**
     * 
     * Add Eventlistener to time slot
     */
    function addEventListenerToTimeSlot() {

        let timeSlotsElement = document.querySelectorAll(`#${CONFIG.RESERVATIONS_LIST} .slot-active`);

        //for each element of time slots add event listener on click 
        for (let slot of timeSlotsElement) {
            slot.addEventListener("click", function () {
                // chsnge status of clicked slot
                this.innerText = this.classList.contains(CONFIG.SELECTED) ? "click to select" : "click to remove selection";
                this.classList.toggle(CONFIG.SELECTED);
            });
        }
    }

    /**
     * Add HTML element to create save modifications button 
     */
    function addSaveModificationsButton() {
        // acreate the row element, the parent for days and time slots
        let buttonElement = document.createElement("div");
        buttonElement.classList.add("col-12", "text-end", "p-4");

        // add time slots element on large devices
        // add disbled class after checking settings disable_modification
        buttonElement.innerHTML = `<button class="btn action-button-secondary" id="${CONFIG.SAVE_MODIFICATIONS}">
                                     Save Modifications
                                 </button>`;
        return buttonElement;
    }

    /**
     * Add event listener to save modifications button
     */
    function addEventListenerToSaveButton(loggedinTeacher, chosenClass, settings, reservations) {
        let saveButton = document.getElementById(CONFIG.SAVE_MODIFICATIONS);

        
        // check if the admin closed the modifications than disable the save button
        if(settings[CONFIG.DISABLE_MODIFICATION]) {
            // add disable class to save modifications button
            saveButton.setAttribute("disabled", true);
        }else {
            saveButton.addEventListener("click", function () {

                // check if any the loggedin teacher in the storage has been changed,
                // this will be done by opening another tab and logout and login again with another teacher
                const currentLoggedin = checkCurrentLoggedIn(loggedinTeacher);
                if (!currentLoggedin) {
                    // get all selected slot 
                    const selectedSlots = document.querySelectorAll(`#${CONFIG.RESERVATIONS_LIST} .selected`);
                    // teachers rervations on chosen class 
                    const teacherClassReservation = reservations.teacherClassReservation;
                    // check if the teacher does not exceed the number of lessons allocated to the class
                    if (selectedSlots && selectedSlots.length <= teacherClassReservation[CONFIG.REQUIRED_TIME_SLOTS]) {
                        // get the current reservations from storage and compare them with 
                        // the reservation we have, to ensure that no changes occured during the selection process 
                        // and that will haben by opening new tab
                        const currentStorageReservations = getItemFromStorage(CONFIG.RESERVATIONS);
                        const currentReservations = filterReservations(loggedinTeacher, chosenClass, currentStorageReservations, false);
    
    
                        const isTeachersResrvationsChanged = reservationsListChanged(currentReservations.teacherReservations,
                            reservations.teacherReservations);
                        const isClassResrvationsChanged = reservationsListChanged(currentReservations.classReservations,
                            reservations.classReservations);
                        const isTeacherCLassResrvationChanged = reservationChanged(currentReservations.teacherClassReservation,
                            teacherClassReservation);
    
                        if (!(isTeachersResrvationsChanged || isClassResrvationsChanged || isTeacherCLassResrvationChanged)) {
    
                            // the changes will be saved successfully to the storage in reservations
                            const newTimeSlotsList = createTimeSlotsList(selectedSlots);
                            // update reservations for the loggedin teacher 
                            const reservationIndex = currentStorageReservations.findIndex((res) =>
                                res[CONFIG.TEACHER_ID] == loggedinTeacher[CONFIG.ID] && res[CONFIG.CLASS_ID] == chosenClass[CONFIG.ID]);
    
                            currentStorageReservations[reservationIndex][CONFIG.TIMES_SLOTS] = newTimeSlotsList;
    
                            // check if the teacher reached the  number of leasons allocated to the class
                            currentStorageReservations[reservationIndex][CONFIG.ASSIGNED_COMPLETED] = selectedSlots.length === teacherClassReservation[CONFIG.REQUIRED_TIME_SLOTS];
                            
                            setItemInStorage(CONFIG.RESERVATIONS, currentStorageReservations);
    
                            // display a message to informe the user that there his changes were successfuly saved 
                            displayMessageModal(`Your changes have been saved successfully.`, true,
                                function () {
                                    redirect(CONFIG.SCHEDULE_PAGE);
                                });
    
    
                        } else {
                            // if the user has oped another tab and make a changes in another class then
                            // returnd to this class, the chose class then is changed 
                            // in order to restore the class we set the old value of chosen class again in the storage
                            setItemInStorage(CONFIG.CHOSEN_CLASS, chosenClass);
                            // display a message to informe the user that there is some changes 
                            // occured during his selection, so he should refrech the page
                            displayMessageModal(`Some new selections occured during your modifictions please refrech the page`, true,
                                function () {
                                    redirect(CONFIG.SCHEDULE_PAGE);
                                }
                            );
                        }
    
                    } else {
                        // display a message to informe the user that he exceed the number of 
                        // required count of lessons
                        displayMessageModal(`You have selected more than ${teacherClassReservation[CONFIG.REQUIRED_TIME_SLOTS]}.
                                              Please remove some selections before continue`, false);
                    }
                }
    
            });
        }
    }

    /*
     * Display teacher name on the header of schedule page
     */
    function displayTeacherName(teacher) {
        let teacherNameElement = document.getElementById(CONFIG.TEACHER_NAME_ELEMENT);
        let displayedText = "Teacher not found";
        if (teacher) {
            displayedText = teacher[CONFIG.TEACHER_USERNAME];
        }
        teacherNameElement.innerText = displayedText;
    }

    /*
     * Display class name on the header of schedule page
     */
    function displayClassName(chosenClass) {
        let classNameElement = document.getElementById(CONFIG.CLASS_NAME_ELEMENT);
        let displayedText = "class not found";
        if (chosenClass) {
            displayedText = chosenClass[CONFIG.CLASS_NAME];
        }
        classNameElement.innerText = displayedText;
    }

    /*
     * Display reservations not found on reservations section
     */
    function displayReservationsNotFound() {
        let reservationsElement = document.getElementById(CONFIG.RESERVATIONS_LIST);
        let element = document.createElement("div");
        element.classList.add("col-12", "text-center");
        element.innerText = "Reservations not found";
        reservationsElement.appendChild(element);
        hideLoader();
    }

    /*
     * Display lessons count
     */
    function displayLessonsCount(teacherClassReservation) {
        let lessonCountElement = document.getElementById(CONFIG.LESSON_COUNT_ELEMENT);
        let displayedText = 0;
        if (teacherClassReservation) {
            displayedText = teacherClassReservation[CONFIG.REQUIRED_TIME_SLOTS];
        }
        lessonCountElement.innerText = displayedText;
    }


});