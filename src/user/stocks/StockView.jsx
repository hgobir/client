import React, {useEffect, useState} from 'react';
import {accountService} from "@/_services";
import {Link} from "react-router-dom";


function StockView({ history, match }) {
    const { id } = match.params;
    // const { path } = match;


    const [stock, setStock] = useState({});
    const [company, setCompany] = useState({});
    const [marketCapitalisation, setMarketCapitalisation] = useState(0)
    const [refreshCounter, setRefreshCounter] = useState(0)
    const STOCK_REFRESH_RATE = 300000;


    useEffect(() => {
            accountService.getCompanyById(Number.parseInt(id)).then(company => company.json()).then(companyFromServer => {
                setStock(companyFromServer['stock'])
                setCompany(companyFromServer)
                setMarketCapitalisation(companyFromServer['stock'].currentValue * companyFromServer['stock'].currentVolume )
            });
    }, [refreshCounter]);

    useEffect(() => {
        const interval = setInterval(() => {
            // console.log(`logged every minute to test!`)
            setRefreshCounter(refreshCounter + 1)
        }, STOCK_REFRESH_RATE);
        return () => clearTimeout(interval);
    })


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container">
                                <p className="lead">Stock Profile</p>
                                <h1 className="display-4" style={{fontWeight: "bolder"}}>{company.name}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-8">
                        {company.description}
                    </div>
                    <div className="col-2 col-md-offset-2">
                        <Link to={`/user/stocks/buy/${id}`} className="btn btn-success" style={{display: "block", height: "100%", width: "100%", color: "white", fontWeight: "bolder", textAlign: "center", fontSize: "60px"}}>
                            BUY
                        </Link>
                    </div>
                    <div className="col-2 col-md-offset-2">
                        <Link to={`/user/stocks/sell/${id}`} className="btn btn-danger" style={{display: "block", height: "100%", width: "100%", color: "white", fontWeight: "bolder", textAlign: "center", fontSize: "60px"}}>
                            SELL
                        </Link>
                    </div>
                </div>
                <br />
                <br />
                <div className="row">
                    <div className="col-6">
                        put graph here when ready!
                    </div>
                    <div className="col-6 col-md-offset-4">
                        <div className="card">
                            <div className="card-header">
                                Stock Information
                            </div>
                            <div className="card-body">
                                <table className="table table-hover table-striped">
                                    <tbody>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Symbol</td>
                                        <td>{stock.symbol}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Close</td>
                                        <td>{stock.close}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Open</td>
                                        <td>{stock.open}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Value</td>
                                        <td>{stock.currentValue}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Volume</td>
                                        <td>{stock.currentVolume}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Gains</td>
                                        <td>{stock.gains}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Market Capitalisation</td>
                                        <td>{marketCapitalisation}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export { StockView };