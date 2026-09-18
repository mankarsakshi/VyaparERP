
const Product = require("../model/Product");

const getBusinessId = (req) => {
    return req.user?.business_id || req.user?.id;
};

exports.createProduct = async (req, res) => {
    try {
        const businessId = getBusinessId(req);

        if (!businessId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const {
            product_name,
            category_id,
            unit,
            hsn_code,
            gst_rate,
            sgst,
            cgst,
            igst,
            purchase_price,
            selling_price,
            minimum_stock,
            status
        } = req.body;

        if (!product_name || !product_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Product name is required"
            });
        }

        const productId = await Product.createProduct({
            business_id: businessId,
            product_name: product_name.trim(),
            category_id,
            unit,
            hsn_code,
            gst_rate,
            sgst,
            cgst,
            igst,
            purchase_price,
            selling_price,
            minimum_stock,
            status
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: { id: productId }
        });

    } catch (error) {
        console.error("Error in Product creation:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error in Product Creation"
        });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const products = await Product.getProducts(businessId);

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch products"
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const productId = req.params.id;

        const product = await Product.getProductById(productId, businessId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch product"
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const productId = req.params.id;

        const updated = await Product.updateProduct(productId, businessId, req.body);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Product not found or update failed"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update product"
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const productId = req.params.id;

        const deleted = await Product.deleteProduct(productId, businessId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Product not found or deletion failed"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete product"
        });
    }
};