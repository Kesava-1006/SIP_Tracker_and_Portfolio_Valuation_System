const {signJWT} = require('../utility/authManager');

const {insertNewSip,getSip} = require('../model/sipModel')

const insertSip = async (request, response) => {
    const {
        portfolio_id,
        fund_id,
        sip_amount,
        sip_date,
        start_date,
        end_date,
        status
    } = req.body;

    // Validate the input data
    if (!portfolio_id|| !sip_amount || !sip_date) {
        return response.status(400).json({ message: "All fields are required" });
    }

    // Call the model function to insert the SIP
    const result = await insertNewSip(portfolio_id, fund_id, sip_amount, sip_date, start_date, end_date, status);
    return response.json(result);
}

const getSipById = async (request, response) => {
    const sipId = request.params.sipId;

    // Call the model function to get the SIP by ID
    const result = await getSip(sipId);
    return response.json(result);
}

const processSip = async (request, response) => {
    const sipId = request.params.sipId;

    // Call the model function to process the SIP
    const result = await processNewSip(sipId);
    return response.json(result);   
}

module.exports = {
    insertSip,
    getSipById,
    //processSip
}
