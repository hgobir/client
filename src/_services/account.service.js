import {BehaviorSubject} from 'rxjs';
import config from 'config';
import {fetchWrapper, history } from "@/_helpers";
import {appConstants} from "@/_constants";
import {alertService} from "@/_services/alert.service";

const userSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}`;

export const accountService = {

    login,
    logout,
    refreshToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    createCreditCard,
    updateAvailableFunds,
    getCreditCards,
    sendUnregisterEmail,
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value }
}

function login(username, password) {
    let jwtToken = ''
    return fetchWrapper.post(`${appConstants.SERVER_URL}/login`, {username: username, password: password})
        // .then(response => response.json())
        .then(response => {
            jwtToken = response.headers.get('Authorization');
            if (jwtToken !== null) {
                localStorage.setItem("jwt", jwtToken)
                return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/authorized/${username}`, {'Authorization': jwtToken})
                    .then(res => res.json())
                    .then((user) => {
                        userSubject.next(user);
                        // startRefreshTokenTimer();
                        localStorage.setItem('user', JSON.stringify(user));
                        return user
                    })
            }
        }).catch(error => {
            console.log(`this is error ${error}`)
            // setSubmitting(false);
            alertService.error(error);
        });
}

function logout() {
    // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
    stopRefreshTokenTimer();
    userSubject.next(null);
    localStorage.removeItem("user")
    localStorage.removeItem("jwt")
    history.push('/account/login');
}

function refreshToken() {
    return fetchWrapper.post(`${baseUrl}/refresh-token`, {})
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            userSubject.next(user);
            startRefreshTokenTimer();
            return user;
        });
}

function register(params) {
    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/registration`, params);
}

function verifyEmail(token) {
    // http://localhost:8081/api/v1/server/registration/confirm
    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/registration/confirm/` + token);
}

function forgotPassword(email) {
    // /api/v1/server/applicationUser/accounts/forgotPassword/{{email}}
    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/accounts/forgotPassword/` + email);
}

function validateResetToken(token) {
    // /api/v1/server/applicationUser/accounts/forgotPassword/validate/{{token}}
    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/accounts/forgotPassword/validate/` + token);
}
// POST http://localhost:8081/api/v1/server/applicationUser/accounts/resetPassword/{{token}}/{{password}}
function resetPassword({ token, password, confirmPassword }) {
    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/accounts/resetPassword/${token}/${password}`);
}

function getUsers() {

    const jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/admin/users/`, {'Authorization': jwtToken});
}

function getUserById(id) {
    const jwtToken = localStorage.getItem("jwt")

    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/admin/users/${id}`, {'Authorization': jwtToken});
}

function createUser(params) {

    // /api/v1/server/applicationUser/admin/users/createUser/{{username}}/{{password}}/{{email}}/{{firstName}}/{{lastName}}/{{role}}
    const jwtToken = localStorage.getItem("jwt")
    const {username, password, email, firstName, lastName, role } = params
    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/admin/users/createUser/${username}/${password}/${email}/${firstName}/${lastName}/${role}`,{} , jwtToken);

    // return fetchWrapper.post(baseUrl, params);
}

function updateUser(id, params) {

    console.log("update method called!")

    const jwtToken = localStorage.getItem("jwt")
    const {username, password, email, firstName, lastName, role } = params
    console.log(`this is what role is ${role}`)
    let newRole = role
    if(role === undefined) {
        console.log("inside if statement because role is undefined!")
        newRole = "user";
    }
    return fetchWrapper.put(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/admin/users/changeUser/${id}/${username}/${password}/${email}/${firstName}/${lastName}/${newRole}`,  jwtToken)
        .then(user => user.json())
        .then(updatedUser => {
            console.log(`this is updatedUser! ${updatedUser}`)
        // updateUser stored updatedUser if the logged in updatedUser updated their own record
        if (updatedUser.id === userSubject.value.id) {
            // publish updated updatedUser to subscribers
            updatedUser = { ...userSubject.value, ...updatedUser };
            userSubject.next(updatedUser);
        }
        return updatedUser;
    });
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function deleteUser(id) {
    const jwtToken = localStorage.getItem("jwt")

    return fetchWrapper.delete(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/admin/users/${id}`,  jwtToken)
        .then(x => x.text())
        .then(x => {
            // auto logout if the logged in user deleted their own record
            console.log(`this is x ${x}`)
            console.log(`this is userSubject ${JSON.stringify(userSubject.value)}`)
            if (id === userSubject.value.applicationUserId) {
                logout();
            }
            return x;
        });
}


function getCompanies() {

    // const jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.STOCK_MODULATION_URL}/api/v1/stockModulation/admin/companies`);
}

function getCompanyById(id) {
    // const jwtToken = localStorage.getItem("jwt")

    // return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/admin/users/${id}`, {'Authorization': jwtToken});
    return fetchWrapper.get(`${appConstants.STOCK_MODULATION_URL}/api/v1//stockModulation/admin/companies/${id}`);
}


function updateCompany(id, params) {

    // const jwtToken = localStorage.getItem("jwt")
    const {name, description, sector, ceo, address, valuation } = params
    return fetchWrapper.put(`${appConstants.STOCK_MODULATION_URL}/api/v1/server/applicationUser/admin/companies/${id}/${name}/${description}/${sector}/${ceo}/${address}/${valuation}`)
        .then(company => company.json())
        .then(updatedCompany => {
            console.log(`this is updatedCompany! ${updatedCompany}`)
            // updateUser stored updatedUser if the logged in updatedUser updated their own record
            // if (updatedUser.id === userSubject.value.id) {
            //     // publish updated updatedUser to subscribers
            //     updatedUser = { ...userSubject.value, ...updatedUser };
            //     userSubject.next(updatedUser);
            // }
            return updatedCompany;
        });
}

function createCompany(params) {

    // /api/v1/server/applicationUser/admin/users/createUser/{{username}}/{{password}}/{{email}}/{{firstName}}/{{lastName}}/{{role}}
    const jwtToken = localStorage.getItem("jwt")
    const {name, description, sector, ceo, address, valuation } = params
    return fetchWrapper.post(`${appConstants.STOCK_MODULATION_URL}/api/v1/stockModulation/admin/companies/${name}/${description}/${sector}/${ceo}/${address}/${valuation}`)

    // return fetchWrapper.post(baseUrl, params);
}

function deleteCompany(id) {
    const jwtToken = localStorage.getItem("jwt")

    return fetchWrapper.delete(`${appConstants.STOCK_MODULATION_URL}/api/v1//stockModulation/admin/companies/${id}`);
        // .then(x => x.text())
        // .then(x => {
        //     // auto logout if the logged in user deleted their own record
        //     console.log(`this is x ${x}`)
        //     console.log(`this is userSubject ${JSON.stringify(userSubject.value)}`)
        //     if (id === userSubject.value.applicationUserId) {
        //         logout();
        //     }
        //     return x;
        // });
}

function createCreditCard(id, number, name, expiry, cvc) {
    const jwtToken = localStorage.getItem("jwt")

    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/user/creditCards/${id}/${name}/${number}/${expiry}/${cvc}`, {} ,jwtToken)
        .then(user => user.json())
        .then(verifiedUser => {
            console.log(`this is updatedUser! ${JSON.stringify(verifiedUser)}`)
            localStorage.removeItem("user")
            // updateUser stored updatedUser if the logged in updatedUser updated their own record
            if (verifiedUser.id === userSubject.value.id) {
                // publish updated updatedUser to subscribers
                console.log(`this is were we reset user!`)
                verifiedUser = { ...userSubject.value, ...verifiedUser };
                userSubject.next(verifiedUser);
                localStorage.setItem("user", JSON.stringify(verifiedUser))
                // localStorage.removeItem("user")
                return verifiedUser;
            }


    });
}

function updateAvailableFunds(id) {

    const jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/accounts/availableFunds/${id}`, {'Authorization': jwtToken});

}

function getCreditCards(id) {

    const jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/applicationUser/accounts/creditCards/${id}`, {'Authorization': jwtToken});

}

function sendUnregisterEmail(id, email) {

    const jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/registration/unregister/${id}`, email, jwtToken)

}






// helper functions

let refreshTokenTimeout;

function startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(localStorage.getItem("jwt").split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout);
}



