// import config from 'config';
import {fetchWrapper} from '../_helpers';
import {appConstants} from "@/_constants";

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};


function login(username, password) {

    let jwtToken = ''
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({username: username, password: password})
    };

    console.log("first part of login!")
    return fetch(`${appConstants.SERVER_URL}/login`, requestOptions)
        // .then(response => response.json())
        .then(response => {
            // const responseJson = response.
            // const { method, headers } = opts;
            // const body = opts.body && JSON.parse(opts.body);
            console.log(`this is what response headers looks like!! ${response.headers.get("Authorization")}`)

            jwtToken = response.headers.get('Authorization');

            if (jwtToken !== null) {


                localStorage.setItem("jwt", jwtToken)


                console.log(`this is what is inside localStorage ${localStorage.getItem("jwt")}`)

                return fetch(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/authorized/${username}`, {
                    method: 'GET',
                    headers: {'Authorization': jwtToken},
                })
                    .then(res => res.json())
                    .then((user) => {
                        console.log(`this is user returned from backend after jwt authorization! ${JSON.stringify(user)}`)

                        localStorage.setItem('user', JSON.stringify(user));

                        // const userJson = user.json()

                        return user
                    })
            }
        })
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
}

function getAll() {
    // const requestOptions = {
    //     method: 'GET',
    //     headers: authHeader()
    // };

    //their version
    // return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);

    //my version
    // return fetch(`${appConstants.SERVER_URL}/api/applicationUsers`, requestOptions).then(handleResponse);

}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: fetchWrapper.authHeader()
    };

    //their version
    // return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);

    //my version
    return fetch(`${appConstants.SERVER_URL}/api/applicationUsers/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(user)
    };

    //their version
    // return fetch(`${config.apiUrl}/users/register`, requestOptions).then(handleResponse);

    //my version
    return fetch(`${appConstants.SERVER_URL}/api/v1/server/registration`, requestOptions).then(handleResponse);

}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    //their version
    // return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);

    //my version
    return fetch(`${appConstants.SERVER_URL}/api/applicationUsers/${user.id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    //their version
    // return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);

    //my version
    return fetch(`${appConstants.SERVER_URL}/api/applicationUsers/${id}`, requestOptions).then(handleResponse);
}

//need to fix!!
function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        // if (response === null) {
            if (response.status === 401 || response.status === 403) {
                console.log(`this is response from login!! ${response.statusText}`)

                // auto logout if 401 response returned from api
            logout();
            // eslint-disable-next-line no-restricted-globals
            location.reload(true);
            // }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
        }
        return data;
    });
}






