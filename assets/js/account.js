/**
 * 
 * 
 * This file will control the account page (account.html) 
 * 1. Ensure that a teacher is logged in by checking the value 
 *    of the variable (loggedin_teacher) from the browser storage.
 *    If the loggedin_teacher is null, it will redirect the user to start page (index.html). 
 * 
 * 
 * 2. After the documet content loaded 
 *    the classes for logged in teacher will be fetched from classes.json file 
 *    and the classes will be displayed in the classes list on the account page.
 * 
 * 3. add event listener to Modify Schedule button, 
 *    when a Modify Schedule button clicked, it will take
 *    the user to schedule page.
 * 
 * 
 * 4. Add event listener to logout button
 *    when logout button clicked then the user will be
 *    redirected to start page and the (loggedin_teacher) will be removed from storage
 * 
 */




/**
 * call function (loginCheck), which is declared in helper.js file 
 * before fetching the classes data.
 * If the loggedin_teacher is null, it will redirect the user to start page. 
 */
window.onload = function () {
    //call loginCheck function with loggedin_teacher parameter to check the teacher in browser storage
    loginCheck(function (isLoggedIn) {
        // remove  chosen class and edited reservations from storage if they are stored
        // because those keys associated with the time slots reservation process 
        removeItemsFromStorage([CONFIG.CHOSEN_CLASS, CONFIG.CLASS_RESERVATIONS,
            CONFIG.TEACHER_RESERVATIONS, CONFIG.TEACHER_CLASS_RESERVATION
        ]);
        if (!isLoggedIn) {
            //redirect to teacher account, below function is declared in helper.js file
            redirect(CONFIG.START_PAGE);
        }
    });
}

/**
 * After the documet conetnt loaded, classes data will be fetched and displayed.
 * After finishing loading classes data, the event listener on Modify Schedule buttons will be added.
 */

document.addEventListener("DOMContentLoaded", function () {

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


    // fetch data from teachers.json and classes.json files then fill classes list section on account page
    fetchData();

    /**
     * Fetchig teachers and classes data 
     * get the logged in teacher object according to the loggedin_teacher, which is saved in browser storage
     * display teacher name on the header of account page
     * call fetchClasses function to get the classes
     */
    function fetchData() {

        /* get logged in teacher from browse storage,
         */
        const loggedinTeacher = getItemFromStorage(CONFIG.LOGGED_IN_TEACHER);
        // display teacher name on the header of account page
        displayTeacherName(loggedinTeacher);
        // call fetchClasses function to fetch classes from json file
        fetchClasses(loggedinTeacher);
    }

    /**
     * Fetchig classes by reading classes.json file
     * filter classes according to loggedinTeacher.id
     * then fill classes list on account page
     */
    function fetchClasses(teacher) {
        if (teacher) {

            // check if the classes were not fetched yet
            // by checking classes item in the sotage
            let teacherClasses = getItemFromStorage(CONFIG.CLASSES);
            if (!teacherClasses) {
                // call the fetchJsonFile function, which is declared in helper.js file , to fetch classes from classes.json file
                fetchJsonFile(CONFIG.CLASSES_FILE).then((data) => {
                        //filter classes
                        const classes = filterClassesByTeacher(teacher, data);

                        // store teacher classes to the storage
                        setItemInStorage(CONFIG.CLASSES, classes);

                        // fill classes list
                        fillClassesList(classes, teacher);
                    })
                    .catch((error) => {
                        displayClassesNotFound();
                        throw `Unable to fetch data:", ${error}`;
                    });
            } else {
                fillClassesList(teacherClasses, teacher);
            }

        } else {
            displayClassesNotFound();
            throw `Unable to fetch classes for not found teacher`;
        }

    }

    /**
     * Fill classes list on account page
     */
    function fillClassesList(classes, teacher) {
        if (classes && classes.length) {
            let classesList = document.getElementById(CONFIG.CLASSES_LIST);
            for (let classObj of classes) {
                let element = document.createElement("div");
                element.classList.add("col-12", "col-md-6", "col-xl-4");
                element.innerHTML = ` <div class="card">
                    <div class="card-body">
                      <h3>${classObj[CONFIG.CLASS_NAME]}</h3>
                      <button class="btn action-button-secondary modify-schedule" 
                              data-class-id="${classObj[CONFIG.ID]}"
                                        aria-label="modify schedule for class ${classObj[CONFIG.CLASS_NAME]}">
                                            Modify Schedule
                                        </button>
                    </div>
                  </div>`;
                classesList.appendChild(element);
            }
            //call hideLoader function, which is declared in helper.js file to hide the loader after fetching data 
            hideLoader();
            //add event listener to Modify Schedule button
            addEventListenerModifyScheduleButton(teacher);
        } else {
            displayClassesNotFound();
        }

    }

    /**
     * event listener to Modify Schedule button
     */
    function addEventListenerModifyScheduleButton(teacher) {

        let modifyScheduleButtons = document.querySelectorAll(`#${CONFIG.CLASSES_LIST} .modify-schedule`);

        for (let button of modifyScheduleButtons) {
            button.addEventListener("click", function (e) {

                // check if any the loggedin teacher in the storage has been changed,
                // this will be done by opening another tab and logout and login again with another teacher
                const currentLoggedinTeacher = getItemFromStorage(CONFIG.LOGGED_IN_TEACHER);
                if (!currentLoggedinTeacher ||
                    currentLoggedinTeacher &&
                    currentLoggedinTeacher[CONFIG.ID] != teacher[CONFIG.ID]) {

                    redirect(CONFIG.ACCOUNT_PAGE);
                    
                } else {
                    //get classes's id from attribute data-class-id
                    const classId = e.target.getAttribute("data-class-id");
                    const classObj = getItemFromStorage(CONFIG.CLASSES).find((cls) => cls[CONFIG.ID] == classId);
                    //save class in browser storage, below function is declared in helper.js file
                    setItemInStorage(CONFIG.CHOSEN_CLASS, classObj);

                    //redirect to teacher account, below function is declared in helper.js file
                    redirect(CONFIG.SCHEDULE_PAGE);
                }
            });
        }

    }


    /**
     * return teacher's classes
     */
    function filterClassesByTeacher(teacher, classes) {
        let filterdClasses = [];
        if (teacher && teacher[CONFIG.TEACHER_CLASSES] && teacher[CONFIG.TEACHER_CLASSES].length) {
            for (let classObj of classes) {
                if (teacher[CONFIG.TEACHER_CLASSES].find((cl) => cl[CONFIG.CLASS_ID] == classObj[CONFIG.ID])) {
                    filterdClasses.push(classObj);
                }
            }
        }
        return filterdClasses;
    }

    /**
     * display teacher name on the header of account page
     */
    function displayTeacherName(teacher) {
        let teacherNameElement = document.getElementById(CONFIG.TEACHER_NAME_ELEMENT);
        let displayedText = "Teacher not found"
        if (teacher) {
            displayedText = teacher[CONFIG.TEACHER_USERNAME];
        }
        teacherNameElement.innerText = displayedText;
    }


    /**
     * Display classes not found message in classes list
     */
    function displayClassesNotFound() {
        let classesListElement = document.getElementById(CONFIG.CLASSES_LIST);
        let element = document.createElement("div");
        element.classList.add("col-12", "text-center");
        element.innerHTML = `<p>No classes Found</p> `;
        classesListElement.appendChild(element);
        // call hideLoader function, which is declared in helper.js file to hide the loader after fetching data 
        hideLoader();
    }

});