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

    // Enable tooltips to display conditions rule on schedule header
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
                //fetch settings data from settings.json file
                fetchJsonFile("settings.json").then((settings) => {

                        // store settings in storage
                        setItemInStorage("settings", settings);
                        // fetch reservations data 
                        fetchReservations(loggedinTeacher, chosenClass, settings);

                    })
                    .catch((error) => {
                        throw `Unable to fetch data:", ${error}`;
                    });

            } else {
                hideLoader();
                throw `cannot find the chosen class`;
            }
        } else {
            hideLoader();
            throw `cannot find the logged in teacher`;
        }
    }


    // Fetching reservations from reservations.json file and display the data
    function fetchReservations(teacher, classObj, settings) {
        // call the fetchJsonFile function, which is declared in helper.js file , to fetch classes from classes.json file
        fetchJsonFile("reservations.json").then((data) => {
                //filter reservations
                const reservations = filterReservations(teacher, classObj, data);
                // fill  time slots
                fillTimeSlotsTable(reservations, settings);
            })
            .catch((error) => {
                displayReservationsNotFound();
                throw `Unable to fetch data:", ${error}`;
            });
    }


    /**
     * Filter reservation according to teacher and class
     */
    function filterReservations(teacher, classObj, reservations) {
        let teacherReservations = [];
        let classReservations = [];
        let teacherClassReservation = null;

        //  filter the reservation that contains teacher id or class id or both
        reservations.every((res) => {
            if (res.teacher_id == teacher.id && res.class_id == classObj.id) {
                teacherClassReservation = res;
            } else if (res.teacher_id == teacher.id) {
                teacherReservations.push(res);
            } else if (res.class_id == classObj.id) {
                classReservations.push(res);
            }
            return res;
        });
        setItemInStorage("teacher_reservations", teacherReservations)
        setItemInStorage("class_reservations", classReservations);
        setItemInStorage("teacher_class_reservation", teacherClassReservation);

        return {
            "teacherReservations": teacherReservations,
            "classReservations": classReservations,
            "teacherClassReservation": teacherClassReservation
        };
    }

    /**
     * Fill time slots table on schedule page
     */
    function fillTimeSlotsTable(reservations, settings) {
        if (reservations && reservations.teacherClassReservation) {
            // Get the reservation related for teacher and class
            const teacherClassReservation = reservations.teacherClassReservation;
            // display lessons count
            displayLessonsCount(teacherClassReservation);
            if (settings && settings.days && settings.time_slots) {
                let reservationsList = document.querySelector("#reservations-list-section");
                // create container elemnt for reservation section
                const containerElement = createReservationContainerElement(reservations, settings,
                    teacherClassReservation.teacher_id, teacherClassReservation.class_id);


                reservationsList.appendChild(containerElement);
                //call hideLoader function, which is declared in helper.js file to hide the loader after displaying data 
                hideLoader();
                //add event listener to Select slot button
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
        rowElement.classList.add("row");

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
        for (let day of settings.days) {
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
            let timeSlotsHtml = '';
            for (let time of settings.time_slots) {
                // Check the slot if it is already occupied or selected from the teacher him self
                const slotClasses = getSlotClasses(reservations, day, time);

                timeSlotsHtml += `<div class="slot ${slotClasses.classes}" data-day="${day}" data-time-slot="${time}" 
                                       data-teacher="${teacher}" 
                                       data-class="${classObj}">
                                          ${slotClasses.message}
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
     * create times html to display on the reservations section on schedule page
     */
    function createTimesHtml(settings) {
        // get all time slots from settings and display them
        let timeSlots = "";
        settings.time_slots.every((time) => timeSlots += `<div class="time">${time}</div>`);
        return timeSlots
    }


    /**
     *  Check the slot if is already occupied or selcted from the teache himself
     */
    function getSlotClasses(reservations, day, time) {

        // if no conditions met
        //then the slot is active and the user can select the slot
        let classList = "slot-active";
        let message = "select";

        // check if the slot is selected from other teachers
        const selectedFromTeacher = reservations.classReservations.filter((res) =>
            res.times_slots && res.times_slots[day] &&
            res.times_slots[day].length && res.times_slots[day].includes(time)
        );

        // check if the slot is selected for another class
        const selectedForClass = reservations.teacherReservations.filter((res) =>
            res.times_slots && res.times_slots[day] &&
            res.times_slots[day].length && res.times_slots[day].includes(time));

        // check if the slot is selected for this class from the teacher himself
        const timeSlotes = reservations.teacherClassReservation.times_slots;
        const selectedFromTeacherClass = timeSlotes && timeSlotes[day] && timeSlotes[day].length ?
            timeSlotes[day].includes(time) : null;

        if (selectedFromTeacher && selectedFromTeacher.length) {
            classList = "slot-disabled";
            message = " Reserved by another teacher ";
        }
        if (selectedForClass && selectedForClass.length) {
            classList = "slot-disabled";
            message += " \n Reserved for another class ";
        }
        if (selectedFromTeacherClass) {
            classList = "selected";
            message = "remove selection";
        }
        return {
            "classes": classList,
            "message": message
        };
    }

    /*
     * Display teacher name on the header of schedule page
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
     * Display class name on the header of schedule page
     */
    function displayClassName(chosenClass) {
        let classNameElement = document.getElementById("class-name");
        let displayedText = "class not found";
        if (chosenClass) {
            displayedText = chosenClass.name;
        }
        classNameElement.innerText = displayedText;
    }

    /*
     * Display reservations not found on reservations section
     */
    function displayReservationsNotFound() {
        let reservationsElement = document.getElementById("reservations-list-section");
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
        let lessonCountElement = document.getElementById("lessons-count");
        let displayedText = 0;
        if (teacherClassReservation) {
            displayedText = teacherClassReservation.required_time_slots;
        }
        lessonCountElement.innerText = displayedText;
    }


});