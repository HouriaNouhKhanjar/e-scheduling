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
    if(!isLoggedin) {
        //redirect to teacher account, below function is declared in helper.js file
        redirect('index.html');
    }
}