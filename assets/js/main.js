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
            for (teacher of data) {
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
            // call hide loader function, which was declared in helper.js file to hide the loader after fetching data 
           hideLoader();
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

});