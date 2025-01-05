// This file contains helper functions to avoid duplicate code

/**
 * Redirect to pageName
 */
function redirect(pageName){
    //get the current url and replace the last element with page name
    const newLocation = window.location.href.replace(/\/[^\/]*$/, `/${pageName}`);
    //replace the new url
    window.location.replace(newLocation);
}



/**
 * check if any teacher was logged in
 */
function loginCheck(key) {
    return getCookie(key)
}

/**
 * save loggedIn teacher id in browser cookies
 */
function loggedIn(key, teacherId) {
    return setCookie(key, teacherId)
}

/**
 * save class id, which will modify its schedule, in browser cookies
 */
function modifyClassSchedule(key, classID) {
    return setCookie(key, classID)
}


/**
 * Get cookie by its name
 */
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

/**
 * Set cookie
 */
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}

/**
 * Fetching Data from JSON File
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

