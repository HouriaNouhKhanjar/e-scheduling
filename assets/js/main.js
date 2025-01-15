/**
 * 
 * 
 * This file will control the start page (index.html) 
 * 1. Ensure that no teacher is logged in by checking the value 
 *    of the variable (loggedin_teacher) from the browser storage.
 *    If the loggedin_teacher is not null, it will redirect the user to the teacher’s account. 
 * 
 * 
 * 2. After the documet content loaded 
 *    the teachers will be fetched from teachers.json file 
 *    and the teachers' data will be displayed in the teachers table on the start page.
 * 
 * 3. add event listener to login button, 
 *    when a login button clicked it will take
 *    the user to teacher account page
 *    and update login data(loggedin_teacher) in browser storage
 * 
 * 
 * 
 */



/**
 * Call function (loginCheck), which is declared in helper.js file 
 * before fetching the teachers data.
 * If the loggedin_teacher is not null, it will redirect the user to the teacher’s account. 
 */
window.onload = function () {
    //call loginCheck function with loggedin_teacher parameter to check the teacher id in browser storage
    loginCheck(function (isLoggedIn) {
        if (isLoggedIn) {
            //redirect to teacher account, below function is declared in helper.js file
            redirect(CONFIG.ACCOUNT_PAGE);
        }
    });

};



/**
 * After the documet conetnt loaded, teachers data will be fetched and displayed.
 * After finishing loading teachers data, the event listener on login buttons will be added.
 */

document.addEventListener("DOMContentLoaded", function () {

    // fetch settings,teacher, reservations data from teachers.json files then fill teachers table on start page by calling fetchTeachers function
    fetchTeachers();



    /**
     * Fetchig teachers, settings, reservations data from teachers.json file
     * then fill teachers table on start page
     */
    function fetchTeachers() {

        // Check if we have not fetch yet, settings data from settings.json
        // by checking settings calue in the storage
        if (!getItemFromStorage(CONFIG.SETTINGS)) {
            // call the fetchJsonFile function, which is declared in helper.js file , to fetch 
            // settings from settings.json and save the settings to the storage
            fetchJsonFile(CONFIG.SETTINGS_FILE).then((settings) => {
                    setItemInStorage(CONFIG.SETTINGS, settings);

                    // call the fetchJsonFile function, which is declared in helper.js file , to fetch 
                    // teachers from  teachers.json and save the teachers to the storage
                    fetchJsonFile(CONFIG.TEACHERS_FILE).then((teachers) => {
                        setItemInStorage(CONFIG.TEACHERS, teachers);
                        fillTeachersTable(teachers);


                        // call the fetchJsonFile function, which is declared in helper.js file , to fetch 
                        // reservations from  reaservations.json and save the reservations to the storage
                        fetchJsonFile(CONFIG.RESERVATIONS_FILE).then((reservations) => {
                            setItemInStorage(CONFIG.RESERVATIONS, reservations);
                            // add action buttons (reset reservations)
                            addActionButtons(settings, reservations);
                        });
                    });
                })
                .catch((error) => {
                    displayTeachersNotFound();
                    throw `Unable to fetch data:", ${error}`;
                });
        } else {
            // if we fetch the data before than get the teachers from storage 
            // and fill teachers table
            fillTeachersTable(getItemFromStorage(CONFIG.TEACHERS));
            addActionButtons(getItemFromStorage(CONFIG.SETTINGS), getItemFromStorage(CONFIG.RESERVATIONS));
        }
    }

    /**
     * Fill teachers table on start page
     */
    function fillTeachersTable(data) {
        if (data) {
            let teachersTable = document.querySelector(`#${CONFIG.TEACHERS_TABLE} tbody`);
            for (let teacher of data) {
                let newRow = document.createElement("tr");
                newRow.innerHTML = ` <th scope="row">${teacher[CONFIG.TEACHER_USERNAME]}</th>
                                    <td>
                                        <button class="btn action-button-secondary login-button" 
                                        data-teacher-id="${teacher[CONFIG.ID]}"
                                        aria-label="log into ${teacher[CONFIG.TEACHER_USERNAME]} account">
                                            Login
                                        </button>
                                    </td>`;
                teachersTable.appendChild(newRow);
            }
            //call hideLoader function, which is declared in helper.js file to hide the loader after fetching data 
            hideLoader();
            //add event listener to login button
            addEventListenerLoginButton();
        } else {
            displayTeachersNotFound();
        }

    }

    /**
     * Add action buttons after teachers table
     */
    function addActionButtons(settings, reaservations) {
        // check if the admin can disable the modifications 
        // by checking if all the teachers have reserved thier required lessons
        const assignedNotCompleted = reaservations.filter((res) => res[CONFIG.ASSIGNED_COMPLETED] === false);
       
        if(!(assignedNotCompleted && assignedNotCompleted.length)){
             settings[CONFIG.CAN_DISABLE_MODIFICATION] = true;
             setItemInStorage(CONFIG.SETTINGS, settings);
        }


        let actionButtonsElement = document.getElementById(CONFIG.ADMIN_ACTION_BUTTONS);
        // add reset button to reset the reservations to the initial state
        addResetButton(actionButtonsElement, settings);
        // add close modifications button
        addCloseModificationsButton(actionButtonsElement, settings);
        // add enable modifications button
        addEnableModificationsButton(actionButtonsElement, settings);

    }

    /**
     * Add reset button HTML element to action buttons
     */
    function addResetButton(actionButtonsElement, settings) {

        let newButton = document.createElement("button");
        newButton.classList.add("btn", "action-button", "m-2", "py-2");
        newButton.innerText = "Reset Reservations";
        // add event listener
        newButton.addEventListener("click", function () {
            resetReservations(settings);
        });
        actionButtonsElement.appendChild(newButton);
    }

    /**
     * change the reservations in the storage and get the initial 
     * data from the reservations.json file
     */
    function resetReservations(settings) {
        // get reservations from  reaservations.json and save the reservations to the storage
        fetchJsonFile(CONFIG.RESERVATIONS_FILE).then((reservations) => {
                setItemInStorage(CONFIG.RESERVATIONS, reservations);

                // edit the disable_modification in settings to false 
                settings[CONFIG.CAN_DISABLE_MODIFICATION] = false;
                settings[CONFIG.DISABLE_MODIFICATION] = false;

                setItemInStorage(CONFIG.SETTINGS, settings);

                displayMessageModal(`The reservations have been reset successfully, please refrech the page.`, true,
                    function () {
                        redirect(CONFIG.START_PAGE);
                    });
            })
            .catch((error) => {
                throw `Unable to fetch data:", ${error}`;
            });
    }

    /**
     * Add close modifications button HTML element to action buttons
     */
    function addCloseModificationsButton(actionButtonsElement, settings) {
        // check if close modifications is possible 
        if (settings[CONFIG.CAN_DISABLE_MODIFICATION] && !settings[CONFIG.DISABLE_MODIFICATION]) {

            let newButton = document.createElement("button");
            newButton.classList.add("btn", "btn-danger", "m-2", "py-2");
            newButton.innerText = "Close Modifications";
            actionButtonsElement.appendChild(newButton);
            // add event listener
            newButton.addEventListener("click", function () {
                closeModifications(settings);
            });
        }
    }

    /**
     * change the disable_modification in the storage to true
     * 
     */
    function closeModifications(settings) {

        // update disable_modification to true in the storage
        // edit the disable_modification in settings to false 
        settings[CONFIG.DISABLE_MODIFICATION] = true;

        setItemInStorage(CONFIG.SETTINGS, settings);

        displayMessageModal(`The modifications have been closed, please refrech the page.`, true,
            function () {
                redirect(CONFIG.START_PAGE);
            });
    }

    /**
     * Add enable modifications button HTML element to action buttons
     */
    function addEnableModificationsButton(actionButtonsElement, settings) {
        // check if enable modifications is possible 
        if (settings[CONFIG.DISABLE_MODIFICATION]) {
            let newButton = document.createElement("button");
            newButton.classList.add("btn", "action-button-secondary", "m-2", "py-2");
            newButton.innerText = "Enable Modifications";
            actionButtonsElement.appendChild(newButton);
            // add event listener
            newButton.addEventListener("click", function () {
                enableModifications(settings);
            });
        }
    }

    /**
     * change the disable_modification in the storage to true
     * 
     */
    function enableModifications(settings) {
        // update disable_modification to true in the storage
        // edit the disable_modification in settings to false 
        settings[CONFIG.DISABLE_MODIFICATION] = false;

        setItemInStorage(CONFIG.SETTINGS, settings);

        displayMessageModal(`The modifications have been enabled, please refrech the page.`, true,
            function () {
                redirect(CONFIG.START_PAGE);
            });

    }


    /**
     * Display Teachers not found message on teachers table
     */
    function displayTeachersNotFound() {
        let teachersTable = document.querySelector(`#${CONFIG.TEACHERS_TABLE} tbody`);
        let newRow = document.createElement("tr");
        newRow.classList.add("text-center");
        newRow.innerHTML = `<th scope="row" colspan="2">No Teachers Found</th> `;
        teachersTable.appendChild(newRow);
        // call hideLoader function, which is declared in helper.js file to hide the loader after fetching data 
        hideLoader();
    }

    /**
     * Add event listener to login button
     */
    function addEventListenerLoginButton() {
        let loginButtons = document.querySelectorAll(`#${CONFIG.TEACHERS_TABLE} .login-button`);
        for (let button of loginButtons) {
            button.addEventListener("click", function (e) {
                //get teacher's id from attribute data-teacher-id
                const teacherId = e.target.getAttribute("data-teacher-id");
                const loggedInTeacher = getItemFromStorage(CONFIG.TEACHERS).find((teacher) => teacher[CONFIG.ID] == teacherId);
                //save logged in teacher's in storage, below function is declared in helper.js file
                loggedIn(loggedInTeacher, CONFIG.ACCOUNT_PAGE, redirect);
            });
        }

    }

});