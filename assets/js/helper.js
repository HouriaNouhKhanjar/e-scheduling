// This file contains helper functions avoiding duplicate code


/**
 * Feting Data from JSON File
 * Input: fileName is a string parameter
 */
function fetchJsonFile(fileName) {
    return fetch(`./assets/data/${fileName}`)
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
    let loader = document.getElementById("loader");
    loader.classList.add("hide");
}