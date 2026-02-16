import queryModel from "../models/queryModel.js"; // or whatever your model is named

// Function to list all queries
const listQueries = async (req, res) => {
    try {
        // ❌ WRONG (MongoDB): const queries = await queryModel.find({});
        
        // ✅ CORRECT (SQL/Sequelize):
        const queries = await queryModel.findAll(); 
        
        res.json({ success: true, queries });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Function to add a query (if you have it)
const addQuery = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // ❌ WRONG (MongoDB): const newQuery = new queryModel({...}); await newQuery.save();

        // ✅ CORRECT (SQL/Sequelize):
        const newQuery = await queryModel.create({
            name,
            email,
            message
        });

        res.json({ success: true, message: "Query Sent Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listQueries, addQuery }