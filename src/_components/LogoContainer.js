import React, { useState, useEffect } from 'react';

import logo from "../resources/images/logo.png";
import {accountService} from "@/_services";


function LogoContainer() {


    const user = localStorage.getItem("user")

    const {verified, availableFunds} = user

    // useEffect(() => {
    //
    //     if(verified === true) {
    //
    //     }
    //
    //
    // })



    return (
        <div style={{width: "200px", height: "40px", backgroundColor: "#0c446c", color: "white", textAlign: "center", padding: "5px", borderWidth: "3px", borderStyle: "solid", borderColor: "white"}}>

            <p>alphatrader {verified === true ? ` | funds available: ${availableFunds}` : ""} </p>

        </div>
    );
}


export { LogoContainer };