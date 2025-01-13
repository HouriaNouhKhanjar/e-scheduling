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
    DAYS: "days",
    DAY: "day",

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
 * Save loggedIn teacher in browser storage
 */
function loggedIn(teacher, pageName, callback) {
    setItemInStorage(CONFIG.LOGGED_IN_TEACHER, teacher);
    callback(pageName);
}

/**
 * remove more than one item from storage
 */
function removeItemsFromStorage(keys) {
    for (let key of keys) {
        if(getItemFromStorage(key)) {
            deleteItemFromStorage(key);
        }
    }
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