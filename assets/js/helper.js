// This file contains helper functions to avoid duplicate code

/**
 * Redirect to pageName
 */
function redirect(pageName){
    const newLocation = window.location.href.replace(/\/[^\/]*$/, `/${pageName}`);
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

