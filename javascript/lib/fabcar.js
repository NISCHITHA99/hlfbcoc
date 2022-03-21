/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class CoC extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const cases = [
            {
                "investigatorName": "Monica",
                "crimeName": "childpronography",
                "investigatorRank": "I",
                "policeStation": "state",
                "crimeNumber": "12341",
                "seizurememoNumber": "121",
                "seizurePlace": "villa",
                "seizureDate": "6 Janaury 2021",
                "seizureTime": "13:36:36",
                "suspectName": "Jayanth",
                "suspectAddress": "Khazakuttam 71, 86383 Thrivendrum",
                "witnessName": "Dhuvesh",
                "caseStatus": "NA",
                "reportPath": "NA",
            },
            {
                "investigatorName": "Kiran",
                "crimeName": "emailfraud",
                "investigatorRank": "II",
                "policeStation": "state",
                "crimeNumber": "12342",
                "seizurememoNumber": "122",
                "seizurePlace": "home",
                "seizureDate": "6 march 2021",
                "seizureTime": "19:36:25",
                "suspectName": "Jayalakshmi",
                "suspectAddress": "Khazakuttam 51, 58383 Thrivendrum",
                "witnessName": "Druva",
                "caseStatus": "NA",
                "reportPath": "NA",
            },
            {
                "investigatorName": "Manish",
                "crimeName": "childpronography",
                "investigatorRank": "I",
                "policeStation": "state",
                "crimeNumber": "12343",
                "seizurememoNumber": "123",
                "seizurePlace": "villa",
                "seizureDate": "6 june 2021",
                "seizureTime": "15:36:36",
                "suspectName": "Jayanth",
                "suspectAddress": "Khalathur 71, 86383 Thrivendrum",
                "witnessName": "Sumesh",
                "caseStatus": "NA",
                "reportPath": "NA",
            },
            {
                "investigatorName": "Saurav",
                "crimeName": "identity theft",
                "investigatorRank": "I",
                "policeStation": "state",
                "crimeNumber": "12344",
                "seizurememoNumber": "124",
                "seizurePlace": "villa",
                "seizureDate": "6 July 2021",
                "seizureTime": "13:36:00",
                "suspectName": "Jayanth",
                "suspectAddress": "Khazakuttam 71, 86383 Thrivendrum",
                "witnessName": "Dhuvesh",
                "caseStatus": "NA",
                "reportPath":"NA",
            },
            {
                "investigatorName": "Lisa",
                "crimeName": "childpronography",
                "investigatorRank": "III",
                "policeStation": "state",
                "crimeNumber": "12345",
                "seizurememoNumber": "125",
                "seizurePlace": "villa",
                "seizureDate": "6 august 2021",
                "seizureTime": "13:36:36",
                "suspectName": "Jayanth",
                "suspectAddress": "Khazakuttam 71, 86383 Thrivendrum",
                "witnessName": "Dhuvesh",
                "caseStaus": "NA",
                "reportPath":"NA",
            },
            {
                "investigatorName": "Surabhi",
                "crimeName": "emailfruad",
                "investigatorRank": "I",
                "policeStation": "state",
                "crimeNumber": "12346",
                "seizurememoNumber": "126",
                "seizurePlace": "villa",
                "seizureDate": "6 november 2021",
                "seizureTime": "13:36:36",
                "suspectName": "Jayanth",
                "suspectAddress": "Khazakuttam 71, 86383 Thrivendrum",
                "witnessName": "Dhuvesh",
                "caseStatus": "NA",
                "reportPath": "NA",
            },
        ];

        for (let i = 0; i < cases.length; i++) {
            cases[i].docType = 'case';
            await ctx.stub.putState('CASE' + i, Buffer.from(JSON.stringify(cases[i])));
            console.info('Added <--> ', cases[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCase(ctx, caseNumber) {
        const caseAsBytes = await ctx.stub.getState(caseNumber); // get the case from chaincode state
        if (!caseAsBytes || caseAsBytes.length === 0) {
            throw new Error(`${caseNumber} does not exist`);
        }
        console.log(caseAsBytes.toString());
        return caseAsBytes.toString();
    }

    async createCase(ctx, caseNumber, investigatorName, crimeName, investigatorRank, policeStation, crimeNumber, seizurememoNumber, seizurePlace,seizureDate, seizureTime, suspectName, suspectAddress, witnessName, caseStatus, reportPath) {
        console.info('============= START : Create Case ===========');

        const cas = {
            investigatorName,
            docType: 'case',
            crimeName,
            investigatorRank,
            policeStation,
            crimeNumber,
            seizurememoNumber,
            seizurePlace,
            seizureDate,
            seizureTime,
            suspectName,
            suspectAddress,
            witnessName,
            caseStatus, 
            reportPath,
        };

        await ctx.stub.putState(caseNumber, Buffer.from(JSON.stringify(cas)));
        console.info('============= END : Create Case ===========');
    }

    async queryAllCases(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCaseOwner(ctx, caseNumber, newOwner) {
        console.info('============= START : changeCaseOwner ===========');

        const caseAsBytes = await ctx.stub.getState(caseNumber); // get the case from chaincode state
        if (!caseAsBytes || caseAsBytes.length === 0) {
            throw new Error(`${caseNumber} does not exist`);
        }
        const cas = JSON.parse(caseAsBytes.toString());
        cas .owner = newOwner;

        await ctx.stub.putState(caseNumber, Buffer.from(JSON.stringify(cas)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = CoC;
