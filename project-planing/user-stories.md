## User storys (orderd by MSC prencible)

### User Story 1 (must-have)

- **Feature Title:** Create JSON files

- **User Story:** As a system, I must save the data in a file or repository so that I can work with, check, and process it.

- **Acceptance Criteria:** 

     - The files should store data for teachers, classes and reservations.
     - JSON files must be properly structured and formatted.
     - Each file should contain valid JSON data with appropriate nesting (arrays, objects).
     

- **Tasks:** 
   
     - Design the Data Structure:

        - Plan and define the data structure for each JSON file (teachers, classes, reservation).

     - Create the JSON Files:

        - Create empty JSON files (teachers.json, classes.json, reservation.json).
        - Populate the files with sample data based on the planned structure.
        - Validate Data Integrity.


## User Story 2 (must-have)

- **Feature Title:** Login as a teacher

- **User Story:** As a system administrator, I can log into teachers' accounts in order to modify their schedules.

- **Acceptance Criteria:** 

    - Display teachers table on the start page.
    - The table is responsive.
    - A "Login" button is visible on each teachers' row, allowing administrator to log into the teacher account.
    - Navigate to teacher account after clicking on "Login" button.

- **Tasks:** 

    - Design teachers' table on the start page each row musst contain a "Login" button.
    - Implement an Event listener listens to the click event on "Login" button, to redirect to the teacher account. 
    - Ensure responsive formatting using media query so details display cleanly across devices.

## User Story 3 (must-have)

- **Feature Title:** Classes list

- **User Story:** As a teacher, I want to see a list of my classes, so I can modify class schedule that I chose.

- **Acceptance Criteria:** 

    - The teacher account page displays a list of his classes.
    - Each class includes the class name and "Modify Schedule" button.
    - The list is responsive and looks good on all main device sizes.

- **Tasks:** 

    - Style the classes list.
    - Display teacher classes  after the document content is loaded. This is done through fetching the data from teachers.json file.
    - Implement an Event listener listens to the click event on "Modify Schedule" button, to redirect to the schedule page.

## User Story 4 (must-have)

- **Feature Title:** Edit schedule

- **User Story:** As a teacher, I want to modify my time slots on the displayed schedule so that I can simply reserve or cancel reservation on any time slot.

- **Acceptance Criteria:** 

    - The schedule page displays a time slots schedule.
    - The schedule section is responsive and looks good on all main device sizes.
    - check the ability to modify a time slot as follows:
       - The time slot cannot be reserved if it has already been reserved for another teacher.
       - It is not possible to reserve a time slot if the teacher himself has previously reserved this time slot for other class.
       - Modifying is not possible if the administrator has disbeled editing the schedules.
       - It is possible to cancel a previously reserved time slot by the teacher himself.
    - Time slots within the table respond to clicking if they are enabled.
    - Time slots cannot be clicked if they are disabled and the reason for the inactivity should be shown on them.
    - Allow changes to be saved when finished.

- **Tasks:** 
 
    - Develop the schedule page.
    - Make the page responsive using media query.
    - Implement a procedure to check the permission to modify the time slots.
    - Implement an Event listener listens to the click event on enabled time slots. 
    - Implement a a procedure to disable the ability to modify the time slots if they are disabled, and it is called after the document content is loaded.
    - Design a button to save changes and adding an event listener, when clicked, it saves the changes in the reservation.json file if no other teacher has reserved the time slot beforehand. Otherwise, a message will appear obligating the teacher to modify the reservations in line with the reservations of other teachers.

## User Story 5 (must-have)

- **Feature Title:** Sign out

- **User Story:** As a system administrator, I can sign out of a teacher account to enable another teacher account to log in.

- **Acceptance Criteria:** 

    - A "Sign out" button is visible on each teachers' account page and schedule page, allowing administrator to sign out of the teacher account.
    - Redirect to start page after clicking on "Sign out" button.

- **Tasks:** 

    - Design "Sign out" button.
    - Implement an Event listener listens to the click event on "Sign out" button, to redirect to the start page. 

## User Story 6 (schould-have)

- **Feature Title:** Reset all schedules

- **User Story:** As a system administrator, I can reset all schedules to enable the start of the new semester.

- **Acceptance Criteria:** 

    - A "Reset All Schedules" button is visible on start page, allowing administrator to reset all the schedules.
    - Pause the interactions between the website and the user during the reset process and inform the user when it is completed.

- **Tasks:** 

    - Design "Reset All Schedules" button.
    - Implement an Event listener listens to the click event on "Reset All Schedules" button.
    - Implement the process of emptying the reservation file and designing an interface that prevents any modification until the emptying process is completed, and then displaying the useful message upon completion of the emptying.

## User Story 7 (could-have)

- **Feature Title:** Disable all schedules

- **User Story:** As a system administrator, I can disable all modifications of schedules in order to prevent any modification of the schedules and thus delay the start of the semester and rely on the final timetable.

- **Acceptance Criteria:** 

    - A "Disable All Schedules" button is visible on start page, allowing administrator to disable all the modifications. This button is visible when the condition is met that all teachers have completed their class reservations.

- **Tasks:** 

    - Design "Disable All Schedules" button.
    - Implement an Event listener listens to the click event on "Disable All Schedules" button.
    - Perform the process of disabling the modification of time periods for schedules.



