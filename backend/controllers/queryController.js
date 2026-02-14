import queryModel from "../models/queryModel.js";

// Function for user to send a query
const addQuery = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const queryData = {
            name,
            email,
            message,
            date: Date.now()
        }

        const query = new queryModel(queryData);
        await query.save();

        res.json({ success: true, message: "Query Sent Successfully" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Function for admin to list all queries
const listQueries = async (req, res) => {
    try {
        const queries = await queryModel.find({});
        res.json({ success: true, queries })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { addQuery, listQueries }