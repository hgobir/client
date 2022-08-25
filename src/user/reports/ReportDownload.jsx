import React, {useEffect, useMemo, useState} from 'react';
import { accountService, alertService, tradeService } from '@/_services';
import logo from "../../resources/images/logo.png";


function ReportDownload({ history, match }) {

    const { id } = match.params;
    const { format } = match.params;

    //todo - validation on sell side to limit amount of shares avaialble to sell to total amount of shares owned!!



    useEffect(() => {


        // tradeService.getReport(id, format)
        //     .then(portfoliosFromServer => {
        //         setPortfolios(portfoliosFromServer)
        //     })


    }, []);


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container">
                                <h3 className="display-4" style={{fontWeight: "bold"}}>{format} report being downloaded!</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export { ReportDownload };