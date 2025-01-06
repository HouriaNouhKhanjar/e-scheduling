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
    loginCheck("loggedin_teacher", function (isLoggedIn) {
        deleteItemFromStorage('class');
        if (!isLoggedIn) {
            //redirect to teacher account, below function is declared in helper.js file
            redirect('index.html');
        } else {
            // remove class to make sure that no class id is saved
            deleteItemFromStorage('class');
        }
    });
}

/**
 * After the documet conetnt loaded, classes data will be fetched and displayed.
 * After finishing loading classes data, the event listener on Modify Schedule buttons will be added.
 */

document.addEventListener("DOMContentLoaded", function () {

    // fetch data from teachers.json and classes.json files then fill classes list section on account page
    fetchData();
    // add event listener to logout button 
    addEventListenerlogoutButton();



    /**
     * Fetchig teachers and classes data 
     * get the logged in teacher object according to the loggedin_teacher, which is saved in browser storage
     * display teacher name on the header of account page
     * call fetchClasses function to get the classes
     */
    function fetchData() {

        /* get logged in teacher id from browse storage,
         * loginCheck function is declared in helper.json file will retun loggedin teacher id.
         */
        const loggedinTeacher = getItemFromStorage('loggedin_teacher');
        if (loggedinTeacher) {
            // display teacher name on the header of account page
            displayTeacherName(loggedinTeacher);

            // call fetchClasses function to fetch classes from json file
            fetchClasses(loggedinTeacher);
        } else {
            displayTeacherNotFound();
            displayClassesNotFound();
            throw `cannot find teacher with id ${loggedinTeacherId}`
        }
    }

    /**
     * Fetchig classes by reading classes.json file
     * filter classes according to loggedinTeacher.id
     * then fill classes list on account page
     */
    function fetchClasses(teacher) {
        if (teacher) {
            // call the fetchJsonFile function, which is declared in helper.js file , to fetch classes from classes.json file
            fetchJsonFile("classes.json").then((data) => {
                    //filter classes
                    const classes = filterClassesByTeacher(teacher, data);

                    // fill classes list
                    fillClassesList(classes);
                })
                .catch((error) => {
                    displayClassesNotFound();
                    throw `Unable to fetch data:", ${error}`;
                });
        } else {
            displayClassesNotFound();
            throw `Unable to fetch classes for not found teacher`;
        }

    }

    /**
     * Fill classes list on account page
     */
    function fillClassesList(classes) {
        if (classes && classes.length) {
            setItemInStorage('classes', classes);
            let classesList = document.querySelector("#classes-list-section");
            for (let classObj of classes) {
                let element = document.createElement("div");
                element.classList.add("col-12", "col-md-6", "col-xl-4");
                element.innerHTML = ` <div class="card">
                    <div class="card-body">
                      <h3>${classObj.name}</h3>
                      <button class="btn action-button-secondary modify-schedule" 
                              data-class-id="${classObj.id}"
                                        aria-label="modify schedule for class ${classObj.name}">
                                            Modify Schedule
                                        </button>
                    </div>
                  </div>`;
                classesList.appendChild(element);
            }
            //call hideLoader function, which is declared in helper.js file to hide the loader after fetching data 
            hideLoader();
            //add event listener to Modify Schedule button
            addEventListenerModifyScheduleButton();
        } else {
            displayClassesNotFound();
        }

    }

    /**
     * event listener to Modify Schedule button
     */
    function addEventListenerModifyScheduleButton() {
        let modifyScheduleButtons = document.querySelectorAll("#classes-list-section .modify-schedule");
        for (let button of modifyScheduleButtons) {
            button.addEventListener("click", function (e) {
                //get classes's id from attribute data-class-id
                const classId = e.target.getAttribute("data-class-id");
                const classObj = getItemFromStorage('classes').find((cls) => cls.id == classId);
                //save class in browser storage, below function is declared in helper.js file
                setItemInStorage("class", classObj);
                // remove classes from storage
                deleteItemFromStorage('classes');
                //redirect to teacher account, below function is declared in helper.js file
                redirect('schedule.html');
            });
        }

    }

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


    /**
     * return teacher's classes
     */
    function filterClassesByTeacher(teacher, classes) {
        let filterdClasses = [];
        if (teacher && teacher.classes && teacher.classes.length) {
            for (let classObj of classes) {
                if (teacher.classes.find((cl) => cl["class_id"] == classObj.id)) {
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
        if (teacher) {
            let teacherNameElement = document.getElementById("teacher-name");
            teacherNameElement.innerText = teacher.username;
        } else {
            displayTeacherNotFound();
        }
    }


    /**
     * Display Teacher not found message on teachers table
     */
    function displayTeacherNotFound() {
        let teacherNameElement = document.getElementById("teacher-name");
        teacherNameElement.innerText = "Teacher not found";
    }

    /**
     * Display classes not found message in classes list
     */
    function displayClassesNotFound() {
        let classesListElement = document.getElementById("classes-list-section");
        let element = document.createElement("div");
        element.classList.add("col-12", "text-center");
        element.innerHTML = `<p>No classes Found</p> `;
        classesListElement.appendChild(element);
        // call hideLoader function, which is declared in helper.js file to hide the loader after fetching data 
        hideLoader();
    }

});