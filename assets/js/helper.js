// This file contains helper functions to avoid duplicate code

/**
 * Redirect to pageName
 */
function redirect(pageName) {
    //get the current url and replace the last element with page name
    const newLocation = window.location.href.replace(/\/[^\/]*$/, `/${pageName}`);
    //replace the new url
    window.location.replace(newLocation);
}

/**
 * Check if any teacher was logged in
 */
function loginCheck(key, callback) {
    const loggedinTeacher = getItemFromStorage(key);
    callback(loggedinTeacher);
}

/**
 * check if any teacher is logged in and if any 
 * class is chosen
 */
function loginAndClassCheck(keys, callback) {
    if (keys && keys.length === 2) {
        const loggedinTeacher = getItemFromStorage(keys[0]);
        const classObj = getItemFromStorage(keys[1]);
        callback(loggedinTeacher, classObj);
    } else {
        throw `Error in keys list, checking if the logged in teacher and class are in storage`;
    }
}

/**
 * Save loggedIn teacher in browser storage
 */
function loggedIn(key, teacher, itemsToRemove, pageName, callback) {
    setItemInStorage(key, teacher);
    removeItemsFromStorage(itemsToRemove);
    callback(pageName);
}

/**
 * remove more than one item from storage
 */
function removeItemsFromStorage(keys) {
    for (let key of keys) {
        deleteItemFromStorage(key);
    }
}

/**
 * logout and reset all elements in browser storage
 */
function logout(callback, parameter) {
    clearStorage();
    callback(parameter);
}

/**
 * Get storaged item by its name
 */
function getItemFromStorage(cname) {
    return JSON.parse(localStorage.getItem(cname));
}

/**
 * Set item in strorage
 */
function setItemInStorage(cname, cvalue) {
    localStorage.setItem(cname, JSON.stringify(cvalue));
}

/**
 * Delete storage item
 */
function deleteItemFromStorage(cname) {
    localStorage.removeItem(cname);
}

/**
 * Clear storage items
 */
function clearStorage() {
    localStorage.clear();
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