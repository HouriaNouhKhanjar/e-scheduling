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
 * call function (loginCheck), which is declared in helper.js file 
 * before fetching the teachers data.
 * If the loggedin_teacher is not null, it will redirect the user to the teacher’s account. 
 */
window.onload = function () {
    //call loginCheck function with loggedin_teacher parameter to check the teacher id in browser storage
    loginCheck("loggedin_teacher", function (isLoggedIn) {
        if (isLoggedIn) {
            //redirect to teacher account, below function is declared in helper.js file
            redirect('account.html');
        } else {
            // clear the storage to make sure that no class id is saved
            clearStorage();
        }
    });
}



/**
 * After the documet conetnt loaded, teachers data will be fetched and displayed.
 * After finishing loading teachers data, the event listener on login buttons will be added.
 */

document.addEventListener("DOMContentLoaded", function () {

    // fetch teacher data from teachers.json files then fill teachers table on start page by calling fetchTeachers function
    fetchTeachers();



    /**
     * Fetchig teachers data from teachers.json file
     * then fill teachers table on start page
     */
    function fetchTeachers() {
        // call the fetchJsonFile function, which is declared in helper.js file , to fetch teachers from teachers.json file
        fetchJsonFile("teachers.json").then((data) => {
                setItemInStorage('teachers', data);
                fillTeachersTable(data);
            })
            .catch((error) => {
                displayTeachersNotFound();
                throw `Unable to fetch data:", ${error}`;
            });
    }

    /**
     * Fill teachers table on start page
     */
    function fillTeachersTable(data) {
        if (data) {
            let teachersTable = document.querySelector("#teachers-table tbody");
            for (let teacher of data) {
                let newRow = document.createElement("tr");
                newRow.innerHTML = ` <th scope="row">${teacher.username}</th>
                                    <td>
                                        <button class="btn action-button-secondary login-button" 
                                        data-teacher-id="${teacher.id}"
                                        aria-label="log into ${teacher.username} account">
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
     * Display Teachers not found message on teachers table
     */
    function displayTeachersNotFound() {
        let teachersTable = document.querySelector("#teachers-table tbody");
        let newRow = document.createElement("tr");
        newRow.classList.add("text-center");
        newRow.innerHTML = `<th scope="row" colspan="2">No Teachers Found</th> `;
        teachersTable.appendChild(newRow);
        // call hideLoader function, which is declared in helper.js file to hide the loader after fetching data 
        hideLoader();
    }

    /**
     * add event listener to login button
     */
    function addEventListenerLoginButton() {
        let loginButtons = document.querySelectorAll("#teachers-table .login-button");
        for (let button of loginButtons) {
            button.addEventListener("click", function (e) {
                //get teacher's id from attribute data-teacher-id
                const teacherId = e.target.getAttribute("data-teacher-id");
                const loggedInTeacher = getItemFromStorage("teachers").find((teacher) => teacher.id == teacherId);
                //save logged in teacher's id in storage, below function is declared in helper.js file
                loggedIn("loggedin_teacher", loggedInTeacher, ['teachers'], 'account.html', redirect);
            });
        }

    }

});