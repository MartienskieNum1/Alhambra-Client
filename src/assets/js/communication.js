"use strict";

function fetchFromServer(url, httpVerb, requestBody){
    let options= {};
    options.method = httpVerb;

    options.headers = {};
    options.headers["Content-Type"] = "application/json";

    // Don't forget to add data to the body when needed
    options.body = JSON.stringify(requestBody);

    options.headers["Authorization"] = "Bearer " + localStorage.getItem('playerToken');

    return fetch(url, options)
        .then((response) => {
        if (!response.ok) {
            console.error('%c%s','background-color: red;color: white','! An error occurred while calling the API');
            console.table(response);
        }
        return response.json();
    })
    .then((jsonresponseyouarelookingfor) => {
        return jsonresponseyouarelookingfor
    })
}