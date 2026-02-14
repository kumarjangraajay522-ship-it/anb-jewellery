import SaleConfig from "../models/saleModel.js";

// Update or Create Sale Settings
const updateSaleConfig = async (req, res) => {
    try {
        const { title, subtitle, targetDate, isActive } = req.body;

        // Always update ID 1 so we have a single global configuration
        const config = await SaleConfig.upsert({
            id: 1,
            title,
            subtitle,
            targetDate,
            isActive
        });

        res.json({ success: true, message: "Sale Settings Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Sale Settings
const getSaleConfig = async (req, res) => {
    try {
        const config = await SaleConfig.findByPk(1);
        
        // Return default if nothing exists yet
        if (!config) {
            return res.json({ success: true, saleConfig: { title: "SALE", subtitle: "Coming Soon", targetDate: "", isActive: false } });
        }

        res.json({ success: true, saleConfig: config });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { updateSaleConfig, getSaleConfig };