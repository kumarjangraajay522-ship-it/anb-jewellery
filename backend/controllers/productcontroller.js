import { v2 as cloudinary } from 'cloudinary';
import cloudinaryConfig from '../config/cloudinary.js'; 
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, quantity, mrp } = req.body;

        // Handle Images safely
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to Cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinaryConfig.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // SQL (Sequelize) Create Command
        const product = await productModel.create({
            name,
            description,
            category,
            price: Number(price),
            mrp: Number(mrp) || 0,
            quantity: Number(quantity) || 0,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: sizes ? JSON.parse(sizes) : [],
            image: imagesUrl,
            date: Date.now()
        });

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        // SQL (Sequelize) Find All Command
        const products = await productModel.findAll({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        // SQL (Sequelize) Delete Command
        await productModel.destroy({
            where: { id: req.body.id }
        });
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        // SQL (Sequelize) Find By Primary Key
        const product = await productModel.findByPk(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Function to update stock
const updateStock = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await productModel.findByPk(productId);
        if (product) {
            product.quantity = quantity;
            await product.save();
            res.json({ success: true, message: "Stock Updated" });
        } else {
            res.json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateStock };