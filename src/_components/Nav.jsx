import React, {useState, useEffect, useContext} from 'react';
import { NavLink, Route } from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService } from '@/_services';
import {LogoContainer} from "@/_components/LogoContainer";
import {UserContext} from "@/_helpers/user.context";
import logo from "@/resources/images/logo";

function Nav() {
    const [user, setUser] = useState({});
    const {globalAvailableFunds, setGlobalAvailableFunds} = useContext(UserContext)


    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);

    // only show nav when logged in
    if (!user) return null;

    const {verified, availableFunds} = user

    console.log(`this is availableFunds from user ${availableFunds} \n\n this is globalAvailableFunds from context ${globalAvailableFunds} and this is verified ${verified}`)


    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark justify-content-between">


                <div className="navbar-nav" >
                    <NavLink exact to="/" className="nav-item nav-link mr-3">Home</NavLink>
                    <NavLink to="/profile" className="nav-item nav-link mr-3">Account Details</NavLink>
                    {user.role === Role.Admin &&
                    <NavLink to="/admin" className="nav-item nav-link mr-3">Admin</NavLink>
                    }
                    {
                        user.role === Role.User &&
                            <NavLink to="/user" className="nav-item nav-link mr-3">User</NavLink>
                    }
                    <a onClick={accountService.logout} className="nav-item nav-link mr-3">Logout</a>

                </div>
                {
                    verified === true &&
                    <div style={{display: "inline-block",float: "right", width: "300px", backgroundColor: "#0c446c", color: "white", textAlign: "center", padding: "10px", borderWidth: "3px", borderStyle: "solid", borderColor: "white"}}>
                        {
                            globalAvailableFunds !== null ?
                                <p className={"mb-0"}>Funds Available <strong>£{globalAvailableFunds}</strong></p>
                                :
                                <p className={"mb-0"}>Funds Available <strong>£{availableFunds}</strong></p>
                        }
                    </div>
                }
            </nav>



            <Route path="/admin" component={AdminNav} />
            {
                verified === true &&
                <Route path="/user" component={UserNav} />
            }
        </div>
    );
}

function AdminNav({ match }) {
    const { path } = match;

    return (
        <nav className="admin-nav navbar navbar-expand navbar-light nav justify-content-center">
            <div className="nav nav-tabs">
                <NavLink to={`${path}/users`} className="nav-item nav-link mr-lg-5">Users</NavLink>
                <NavLink to={`${path}/companies`} className="nav-item nav-link mr-lg-5">Companies</NavLink>
            </div>
        </nav>
    );
}

function UserNav({ match }) {
    const { path } = match;

    return (
        <nav className="admin-nav navbar navbar-expand navbar-light nav justify-content-center nav-fill">
            <div className="nav nav-tabs">
                <NavLink to={`${path}/stocks`} className="nav-item nav-link mr-5">Stocks</NavLink>
                <NavLink to={`${path}/reports`} className="nav-item nav-link mr-5">Reports</NavLink>
                <NavLink to={`${path}/transactions`} className="nav-item nav-link mr-5">Transactions</NavLink>
                <NavLink to={`${path}/portfolio`} className="nav-item nav-link mr-5">My Portfolio</NavLink>
                <NavLink to={`${path}/orders`} className="nav-item nav-link mr-5">Orders</NavLink>
            </div>
        </nav>
    );
}

export { Nav };