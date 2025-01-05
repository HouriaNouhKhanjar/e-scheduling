/**
 * 
 * 
 * This file will control the start page (index.html) 
 * 1. Ensure that no teacher is logged in by checking the value 
 *    of the variable (loggedin_teacher_id) in the cookies.
 *    If the loggedin_teacher_id is not null, it will redirect to the teacher’s account. 
 * 
 * 
 * 2. After the documet conetnt loaded 
 *    the teachers will be fetched from teaches.json file 
 *    and the teachers' data will be displayed in the teachers table on the start page.
 * 
 * 3. add event listener to login button, 
 *    when a login button clicked it will take
 *    the user to teacher account page
 *    and update login data(loggedin_teacher_id) to cookies
 * 
 * 
 * 
 */



/**
 * call function (loginCheck), which was declared in helper file 
 * before fetching the teachers data.
 * If the loggedin_teacher_id is not null, it will redirect to the teacher’s account. 
 */
window.onload = function () {
    //call loginCheck function wil loggedin_teacher_id key to chaeck if this key appers in cookies
    const isLoggedin = loginCheck("loggedin_teacher_id");
    if(isLoggedin) {
        redirect('account.html')
    }

}



/**
 * After the documet conetnt loaded  fetch teachers and display them.
 * After finishing loading teachers data, the event listener on login buttons will be added
 */

document.addEventListener("DOMContentLoaded", function () {

    // fetch teacher data from teachers.json files then fill teachers table on start page by calling fetchTeachers function
    fetchTeachers();



    /**
     * Fetichig teachers data from teachers.json file
     * then fill teachers table on start page
     */
    function fetchTeachers() {
        // call the fetchJsonFile function, which was declared in helper.js file , to fetch teachers from teachers.json file
        fetchJsonFile("teachers.json").then((data) =>
                fillTeachersTable(data))
            .catch((error) => {
                console.error("Unable to fetch data:", error)
                displayTeachersNotFound();

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
            //call hide loader function, which was declared in helper.js file to hide the loader after fetching data 
           hideLoader();
           //after loading teachers on teachers table add event listener to login button
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
        // call hide loader function, which was declared in helper.js file to hide the loader after fetching data 
        hideLoader();
    }

    /**
     * add event listener to login button
     */
    function addEventListenerLoginButton() {
        let loginButtons = document.querySelectorAll("#teachers-table .login-button");
        for (let button of loginButtons){
              button.addEventListener("click", function(e){
                //get teacher id from attribute data-teacher-id
                const teacherId= e.target.getAttribute("data-teacher-id");
                //save logged in teacher id in browser cookies
                loggedIn("loggedin_teacher_id", teacherId);
                //redirect to teacher account
                redirect('account.html')
              });
        }

    }

});