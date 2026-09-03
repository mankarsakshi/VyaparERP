const Product = require("../model/Product");
const { getDB } = require("../database/db");

const getBusinessId = (req) => {
    return req.user?.business_id || req.user?.id || 1;
};

const resolveCategoryId = async (rawCategoryName, existingCategoryId, businessId = 1) => {
    if (existingCategoryId) return Number(existingCategoryId);
    if (!rawCategoryName || !String(rawCategoryName).trim()) return null;

    const catName = String(rawCategoryName).trim();
    const db = getDB();

    try {
        const [rows] = await db.query(
            `SELECT id FROM categories WHERE LOWER(TRIM(category_name)) = LOWER(?) LIMIT 1`,
            [catName]
        );

        if (rows && rows.length > 0) {
            return rows[0].id;
        }

        const [result] = await db.query(
            `INSERT INTO categories (business_id, category_name, status) VALUES (?, ?, 'active')`,
            [Number(businessId) || 1, catName]
        );

        return result.insertId;
    } catch (e) {
        console.warn('resolveCategoryId notice:', e.message);
        return null;
    }
};

const extractProductFields = (body) => {
    const rawName = body?.product_name || body?.name || body?.productName || body?.product;
    const rawSku = body?.sku || body?.product_code || body?.productCode;
    const rawCategoryId = body?.category_id || body?.categoryId || null;
    const rawCategoryName = body?.category_name || body?.category || body?.categoryName;
    const rawUnit = body?.unit || 'PCS';
    const rawHsn = body?.hsn_code || body?.hsnCode || body?.hsn;
    const rawGstRate = Number(body?.gst_rate ?? body?.gstRate ?? body?.tax_rate ?? body?.taxRate ?? body?.gst ?? 0);
    
    let rawSgst = Number(body?.sgst ?? 0);
    let rawCgst = Number(body?.cgst ?? 0);
    let rawIgst = Number(body?.igst ?? 0);

    // Auto-compute sgst and cgst if only gst_rate / tax_rate was provided
    if (rawGstRate > 0 && rawSgst === 0 && rawCgst === 0 && rawIgst === 0) {
        rawSgst = Number((rawGstRate / 2).toFixed(2));
        rawCgst = Number((rawGstRate / 2).toFixed(2));
    }

    const rawPurchasePrice = Number(body?.purchase_price ?? body?.purchasePrice ?? body?.rate ?? 0);
    const rawSellingPrice = Number(body?.selling_price ?? body?.sellingPrice ?? body?.price ?? 0);
    const rawOpeningStock = Number(body?.opening_stock ?? body?.openingStock ?? body?.stock ?? 0);
    const rawCurrentStock = body?.current_stock !== undefined && body?.current_stock !== null
        ? Number(body?.current_stock)
        : (body?.currentStock !== undefined && body?.currentStock !== null ? Number(body?.currentStock) : rawOpeningStock);
    const rawMinimumStock = Number(body?.minimum_stock ?? body?.minimumStock ?? body?.min_stock_alert ?? body?.lowStockLevel ?? 5);
    const rawStatus = body?.status || 'active';

    return {
        product_name: rawName ? String(rawName).trim() : '',
        sku: rawSku ? String(rawSku).trim() : null,
        category_id: rawCategoryId ? Number(rawCategoryId) : null,
        category_name: rawCategoryName ? String(rawCategoryName).trim() : null,
        unit: String(rawUnit).trim() || 'PCS',
        hsn_code: rawHsn ? String(rawHsn).trim() : null,
        gst_rate: rawGstRate,
        sgst: rawSgst,
        cgst: rawCgst,
        igst: rawIgst,
        purchase_price: rawPurchasePrice,
        selling_price: rawSellingPrice,
        opening_stock: rawOpeningStock,
        current_stock: rawCurrentStock,
        minimum_stock: rawMinimumStock,
        status: rawStatus
    };
};

exports.createProduct = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const fields = extractProductFields(req.body);

        if (!fields.product_name) {
            return res.status(400).json({
                success: false,
                message: "Product name is required"
            });
        }

        // Resolve category_id from category_name if not directly provided
        if (!fields.category_id && fields.category_name) {
            fields.category_id = await resolveCategoryId(fields.category_name, null, businessId);
        }

        const productId = await Product.createProduct({
            business_id: businessId,
            ...fields
        });

        const createdProduct = await Product.getProductById(productId);

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: createdProduct || {
                id: productId,
                business_id: businessId,
                ...fields
            }
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
        const search = req.query?.search || req.query?.q || req.query?.name || '';
        const products = await Product.getProducts(businessId, search);

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
        const productId = req.params.id;

        const product = await Product.getProductById(productId);
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

        const fields = extractProductFields(req.body);

        if (!fields.product_name) {
            return res.status(400).json({
                success: false,
                message: "Product name is required"
            });
        }

        // Resolve category_id from category_name if needed
        if (!fields.category_id && fields.category_name) {
            fields.category_id = await resolveCategoryId(fields.category_name, null, businessId);
        }

        const updated = await Product.updateProduct(productId, businessId, fields);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Product not found or update failed"
            });
        }

        const product = await Product.getProductById(productId);

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
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
        const productId = req.params.id;

        const deleted = await Product.deleteProduct(productId);
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