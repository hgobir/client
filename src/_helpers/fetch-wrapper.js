import config from 'config';
import { accountService } from '@/_services';

export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete,
    authHeader,
    handleResponse
}

function get(url, authorization) {
    const requestOptions = {
        method: 'GET',
        headers: authorization
    };
    return fetch(url, requestOptions);
}


// function getWithArgs(url, authorization, body) {
//     console.log(`this is body inside getWithArgs method ${body}`)
//     const requestOptions = {
//         method: 'GET',
//         headers: {'Content-Type': 'application/json', Authorization: authorization},
//         body: JSON.stringify(body)
//     };
//     return fetch(url, requestOptions);
// }


function post(url, body, authorization) {

    if (!authorization) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
            // credentials: 'include',
        };
        return fetch(url, requestOptions);
    } else {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: authorization},
            // body: body
            body: JSON.stringify(body)

            // credentials: 'include',
        };

        return fetch(url, requestOptions);

    }

}

function put(url, authorization, body = {}) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: authorization },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url, authorization) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: authorization },
    };
    return fetch(url, requestOptions);
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = accountService.userValue;
    const isLoggedIn = user && user.jwtToken;
    // const isApiUrl = url.startsWith(config.apiUrl);
    if (isLoggedIn) {
        return { Authorization: `Bearer ${user.jwtToken}` };
    } else {
        return {};
    }


    // let user = JSON.parse(localStorage.getItem('user'));

    // if (user && user.token) {
    //     return { 'Authorization': 'Bearer ' + user.token };
    // } else {
    //     return {};
    // }
}

function handleResponse(response) {
    console.log(`this is handleResponse function - and this is response at this location! ${JSON.stringify(response)}`)
    return response
        .then(header => header.json())
        .then(header => {
            console.log(`inside 2nd then clause!! - about to parse header`)
        const data = header && JSON.parse(header);

        // headers

        if (!response.ok) {
            if ([401, 403].includes(response.status) && accountService.userValue) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                accountService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}