import React, {useState} from 'react';
import {accountService, alertService} from "@/_services";
// import Card from "@/user/creditCard/CreditCard";
import Cards from 'react-credit-cards';
import "react-credit-cards/es/styles-compiled.css"
import {Link} from "react-router-dom";



function CreditCardAdd({ match, history }) {

    const [number, setNumber] = useState('')
    const [name, setName] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')
    const [focus, setFocus] = useState('')

    const user = accountService.userValue;


    // const { id } = match.params;
    //
    // const user = accountService.userValue;

    function onSubmit(number, name, expiry, cvc) {

        const id = user.applicationUserId
        createCreditCard(id, number, name, expiry, cvc);
    }
    //todo: need to do credit card validation!
    function createCreditCard(id, number, name, expiry, cvc) {
        accountService.createCreditCard(id, number, name, expiry, cvc)
            .then(() => {
                alertService.success('Credit card added successfully', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    return (
        <>
            <h1 style={{textAlign: "center"}}>Add new credit card</h1>
            <br />
            <Cards
                number={number}
                name={name}
                expiry={expiry}
                cvc={cvc}
                focused={focus}
            />
            <br />
            <form style={{textAlign: "center"}}>
                <input
                type="tel"
                name="number"
                value={number}
                placeholder="number"
                onChange={e => setNumber(e.target.value)}
                onFocus={e => setFocus(e.target.name)}
                />
                <input
                    type="text"
                    name="name"
                    value={name}
                    placeholder="name"
                    onChange={e => setName(e.target.value)}
                    onFocus={e => setFocus(e.target.name)}
                />
                <input
                    type="text"
                    name="expiry"
                    value={expiry}
                    placeholder="MM/YY"
                    onChange={e => setExpiry(e.target.value)}
                    onFocus={e => setFocus(e.target.name)}
                />

                <input
                    type="text"
                    name="cvc"
                    value={cvc}
                    placeholder="cvc"
                    onChange={e => setCvc(e.target.value)}
                    onFocus={e => setFocus(e.target.name)}
                />
            </form>
            <br />
            <div style={{textAlign: "center"}}>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => onSubmit(number, name, expiry, cvc)}>
                    Add
                </button>
                <Link to={'.'} className="btn btn-secondary">Cancel</Link>
            </div>
        </>
    );
}

export { CreditCardAdd };