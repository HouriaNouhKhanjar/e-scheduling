// This file contains helper functions to avoid duplicate code

/**
 * Global Settings Keys
 */
const CONFIG = {
    // storage keys
    LOGGED_IN_TEACHER: "loggedin_teacher",
    TEACHERS: "teachers",
    CLASSES: "classes",
    CHOSEN_CLASS: "chosen_class",
    RESERVATIONS: "reservations",
    SETTINGS: "settings",
    TEACHER_RESERVATIONS: "teacher_reservations",
    CLASS_RESERVATIONS: "class_reservations",
    TEACHER_CLASS_RESERVATION: "teacher_class_reservation",

    // Json Keys
    ID: "id",
    TEACHER_USERNAME: "username",
    TEACHER_ID: "teacher_id",
    TEACHER_CLASSES: "classes",
    CLASS_NAME: "name",
    CLASS_ID: "class_id",
    TIME_SLOTS: "time_slots",
    TIMES_SLOTS: "times_slots",
    REQUIRED_TIME_SLOTS: "required_time_slots",
    DISABLE_MODIFICATION: "disable_modification",
    CAN_DISABLE_MODIFICATION: "can_disable_modification",
    DAYS: "days",
    DAY: "day",
    PAGE_NAME: "page_name",
    PAGE: "page",

    // pages name
    START_PAGE: "index.html",
    ACCOUNT_PAGE: "account.html",
    SCHEDULE_PAGE: "schedule.html",

    // Json file names
    SETTINGS_FILE: "settings.json",
    TEACHERS_FILE: "teachers.json",
    CLASSES_FILE: "classes.json",
    RESERVATIONS_FILE: "reservations.json",


    // HTML main sections' id on index, account, schedule pages
    TEACHERS_TABLE: "teachers-table",
    CLASSES_LIST: "classes-list-section",
    RESERVATIONS_LIST: "reservations-list-section",
    MESSAGE_MODAL: "message-modal",
    MESSAGE: "message",
    DO_ACTION: "do-action",


    // some HTML ids and classes
    TEACHER_NAME_ELEMENT: "teacher-name",
    CLASS_NAME_ELEMENT: "class-name",
    LESSON_COUNT_ELEMENT: "lessons-count",
    LOGOUT: "logout",
    LOADER: "loader",
    HIDE_CLASS: "hide",
    SELECTED: "selected",
    SAVE_MODIFICATIONS: "save-modifications",

    // json data file path
    DATA_PATH: "./assets/data/"
}

/**
 * Redirect to pageName
 */
function redirect(pageName) {
    //get the current url and replace the last element with page name
    const newLocation = window.location.href.replace(/\/[^\/]*$/, `/${pageName}`);
    //replace the new url
    window.location.replace(newLocation);
}

/**
 * Check if any teacher was logged in
 */
function loginCheck(callback) {
    const loggedinTeacher = getItemFromStorage(CONFIG.LOGGED_IN_TEACHER);
    callback(loggedinTeacher);
}

/**
 * check if any teacher is logged in and if any 
 * class is chosen
 */
function loginAndClassCheck(callback) {
    const loggedinTeacher = getItemFromStorage(CONFIG.LOGGED_IN_TEACHER);
    const classObj = getItemFromStorage(CONFIG.CHOSEN_CLASS);
    callback(loggedinTeacher, classObj);
}

/**
 * check if logged in teacher was chanched
 * compare current logged in teacher from the storage with provided teacher
 */
function checkCurrentLoggedIn(teacher, callback) {
    // get current logged in teacher from storage
    const currentLoggedinTeacher = getItemFromStorage(CONFIG.LOGGED_IN_TEACHER);
    // compare between current logged in teacher and the provided teacher
    if (!currentLoggedinTeacher ||
        currentLoggedinTeacher &&
        currentLoggedinTeacher[CONFIG.ID] != teacher[CONFIG.ID]) {

        const isLoggenIn = currentLoggedinTeacher &&
            currentLoggedinTeacher[CONFIG.ID];

        let result = {};
        result[CONFIG.PAGE_NAME] = isLoggenIn ? "refresh the account" : "return to start";
        result[CONFIG.PAGE] = isLoggenIn ? CONFIG.ACCOUNT_PAGE : CONFIG.START_PAGE;

        // display a message to informe the user to redirect to the suitable page
        displayMessageModal(`The login information has changed. Please
            ${result[CONFIG.PAGE_NAME]} page.`, true,
            function () {
                redirect(result[CONFIG.PAGE]);
            });

        // return the result
        return result;
    } else {
        return null;
    }
}

/**
 * Save loggedIn teacher in browser storage
 */
function loggedIn(teacher, pageName, callback) {
    setItemInStorage(CONFIG.LOGGED_IN_TEACHER, teacher);
    callback(pageName);
}

/**
 * logout and reset all elements in browser storage
 */
function logout(pageName) {
    // remove  chosen class and edited reservations from storage if they are stored
    // because those keys associated with the time slots reservation process 
    removeItemsFromStorage([CONFIG.CHOSEN_CLASS, CONFIG.CLASS_RESERVATIONS,
        CONFIG.TEACHER_RESERVATIONS, CONFIG.TEACHER_CLASS_RESERVATION,
        CONFIG.LOGGED_IN_TEACHER, CONFIG.CLASSES
    ]);
    redirect(pageName);
}

/**
 * remove more than one item from storage
 */
function removeItemsFromStorage(keys) {
    for (let key of keys) {
        if (getItemFromStorage(key)) {
            deleteItemFromStorage(key);
        }
    }
}

/**
 * Get storaged item by its name
 */
function getItemFromStorage(cname) {
    return JSON.parse(localStorage.getItem(cname));
}

/**
 * Set item in strorage
 */
function setItemInStorage(cname, cvalue) {
    localStorage.setItem(cname, JSON.stringify(cvalue));
}

/**
 * Delete storage item
 */
function deleteItemFromStorage(cname) {
    localStorage.removeItem(cname);
}

/**
 * Clear storage items
 */
function clearStorage() {
    localStorage.clear();
}

  /**
     * Filter reservation according to teacher and class
     */
  function filterReservations(teacher, classObj, reservations, saveToStorage) {
    let teacherReservations = [];
    let classReservations = [];
    let teacherClassReservation = null;

    //  filter the reservation that contains teacher id or class id or both
    reservations.every((res) => {
        if (res[CONFIG.TEACHER_ID] == teacher[CONFIG.ID] && res[CONFIG.CLASS_ID] == classObj[CONFIG.ID]) {
            teacherClassReservation = res;
        } else if (res[CONFIG.TEACHER_ID] == teacher[CONFIG.ID]) {
            teacherReservations.push(res);
        } else if (res[CONFIG.CLASS_ID] == classObj[CONFIG.ID]) {
            classReservations.push(res);
        }
        return res;
    });

    if (saveToStorage) {
        setItemInStorage(CONFIG.TEACHER_RESERVATIONS, teacherReservations)
        setItemInStorage(CONFIG.CLASS_RESERVATIONS, classReservations);
        setItemInStorage(CONFIG.TEACHER_CLASS_RESERVATION, teacherClassReservation);
    }

    return {
        "teacherReservations": teacherReservations,
        "classReservations": classReservations,
        "teacherClassReservation": teacherClassReservation
    };
}

/**
 * Get time slots list from selected time slots HTML elment List
 * time slot element attributes : day, time-slot, teacher, class 
 */
function createTimeSlotsList(timeSlotsElements) {
    // time slots is an object and the day will be the keys and 
    // the time slots array will be the values
    // ex: {"monday": ["09:00-10:00","10:00-11:00"], "friday": ["10:00-11:00"]}   
    let newTimeSlotsList = {};
    for(let slot of timeSlotsElements) {
        const day = slot.getAttribute(`data-day`);
        const timeSlot = slot.getAttribute(`data-time-slot`);
        if(newTimeSlotsList && !newTimeSlotsList[day]){
            newTimeSlotsList[day] = [];
        }
            newTimeSlotsList[day].push(timeSlot);
    }
    return newTimeSlotsList;

}


/**
 * Compare two reservations list
 */
function reservationsListChanged(reservations1, reservations2) {
    
    //get only the time slots for eache reservations list to compare
    const timeSlots1 = getTimeSlotsFromReservations(reservations1);
    const timeSlots2 = getTimeSlotsFromReservations(reservations2);

    return JSON.stringify(timeSlots1) !== JSON.stringify(timeSlots2);
}


/*
 * get just the time slots for eache reservations object
 */
function getTimeSlotsFromReservations(reservations){

    return reservations? reservations.map((res) => { return res[CONFIG.TIMES_SLOTS] }): null;
}

/**
 * Compare two reservation
 */
function reservationChanged(reservation1, reservation2) {
    
    return JSON.stringify(reservation1[CONFIG.TIMES_SLOTS]) !== JSON.stringify(reservation2[CONFIG.TIMES_SLOTS]);
   
}



/**
 * Fetching Data from JSON File
 * Input: fileName is a string parameter
 */
function fetchJsonFile(fileName) {
    return fetch(`${CONFIG.DATA_PATH}${fileName}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Fetch JSON error! Status: ${res.status}`);
            }
            return res.json();
        });

}

/**
 * Hide the loader
 */
function hideLoader() {
    let loader = document.getElementById(CONFIG.LOADER);
    loader.classList.add(CONFIG.HIDE_CLASS);
}


/**
 * Display modal with a message and a callback
 */
function displayMessageModal(message, displayContinueButton, callback) {
    // display the message modal
    let messageModal = new bootstrap.Modal(document.getElementById(CONFIG.MESSAGE_MODAL), {});
    messageModal.show();

    // add the message
    let messageElement = document.getElementById(CONFIG.MESSAGE);
    messageElement.innerHTML = message;
    
    // would the continue button be displayed or hidden
    if (displayContinueButton) {
        // add event listener to continue button on modal
        let continueButton = document.getElementById(CONFIG.DO_ACTION);
        continueButton.addEventListener("click", callback);
    } else {
        hideContinueButton();
    }

}


/**
 * Hide the Continue button on modal
 */
function hideContinueButton() {
    let button = document.getElementById(CONFIG.DO_ACTION);
    button.classList.add(CONFIG.HIDE_CLASS);
}