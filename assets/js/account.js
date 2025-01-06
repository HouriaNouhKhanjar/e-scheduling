/**
 * 
 * 
 * This file will control the account page (account.html) 
 * 1. Ensure that a teacher is logged in by checking the value 
 *    of the variable (loggedin_teacher_id) from the browser cookies.
 *    If the loggedin_teacher_id is null, it will redirect the user to start page (index.html). 
 * 
 * 
 * 2. After the documet content loaded 
 *    the classes for logged in teacher will be fetched from classes.json file 
 *    and the classes will be displayed in the classes list on the account page.
 * 
 * 3. add event listener to Modify Schedule button, 
 *    when a Modify Schedule button clicked, it will take
 *    the user to schedule page
 * 
 * 
 * 
 */

/**
 * call function (loginCheck), which is declared in helper.js file 
 * before fetching the classes data.
 * If the loggedin_teacher_id is null, it will redirect the user to start page. 
 */
window.onload = function () {
    //call loginCheck function with loggedin_teacher_id key to chaeck if this key appers in browser cookies
    const isLoggedin = loginCheck("loggedin_teacher_id");
    if (!isLoggedin) {
        //redirect to teacher account, below function is declared in helper.js file
        redirect('index.html');
    }
}

/**
 * After the documet conetnt loaded, classes data will be fetched and displayed.
 * After finishing loading classes data, the event listener on Modify Schedule buttons will be added.
 */

document.addEventListener("DOMContentLoaded", function () {

    // fetch data from teachers.json and classes.json files then fill classes list section on account page
    fetchData();



    /**
     * Fetchig teachers and classes data from teachers.json file
     * get the logged in teacher object according to the loggedin_teacher_id, which is saved in browser cookies
     * display teacher name on the header of account page
     * call fetchClasses function to get the classes
     */
    function fetchData() {
        // call the fetchJsonFile function, which is declared in helper.js file , to fetch teachers from teachers.json file
        fetchJsonFile("teachers.json").then((data) => {
                /* get logged in user id from browser cookie,
                 * loginCheck function is declared in helper.json file will retun loggedin teacher id.
                 */
                const loggedinTeacherId = loginCheck("loggedin_teacher_id");
                if (loggedinTeacherId) {
                    // get teacher object by id
                    const teacher = getTeacherByID(loggedinTeacherId, data);
                    // display teacher name on the header of account page
                    displayTeacherName(teacher);

                    // call fetchClasses function to fetch classes from json file
                    fetchClasses(teacher);
                } else {
                    displayClassesNotFound();
                    throw `cannot find teacher with id ${loggedinTeacherId}`
                }

            })
            .catch((error) => {
                displayTeacherNotFound();
                throw `Unable to fetch data:", ${error}`;
            });
    }

    /**
     * Fetchig classes by reading classes.json file
     * filter classes according to teacher_id
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
     * add event listener to Modify Schedule button
     */
    function addEventListenerModifyScheduleButton() {
        let modifyScheduleButtons = document.querySelectorAll("#classes-list-section .modify-schedule");
        for (let button of modifyScheduleButtons) {
            button.addEventListener("click", function (e) {
                //get classes's id from attribute data-class-id
                const classId = e.target.getAttribute("data-class-id");
                //save class id in browser cookies, below function is declared in helper.js file
                modifyClassSchedule("class_id", classId);
                //redirect to teacher account, below function is declared in helper.js file
                redirect('schedule.html');
            });
        }

    }

    /**
     * return teacher's classes
     */
    function filterClassesByTeacher(teacher, classes) {
        let filterdClasses = [];
        if (teacher && teacher.classes && teacher.classes.length) {
            for (let classObj of classes) {
                if (teacher.classes.find((cl) => cl.class_id === classObj.id)) {
                    filterdClasses.push(classObj);
                }
            }
        }
        return filterdClasses;
    }

    /**
     * return the logged in teacher object by his Id
     */
    function getTeacherByID(id, teachers) {
        if (teachers && teachers.length) {
            return teachers.find((te) => parseInt(te.id) === parseInt(id));
        }
        return null;
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