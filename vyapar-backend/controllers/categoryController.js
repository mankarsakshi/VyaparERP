const Category = require('../model/Category');

const getBusinessId = (req) => {
    return req.user?.business_id || req.user?.id;
};

exports.createCategory = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        if (!businessId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const { category_name, description, status } = req.body;

        if (!category_name || !category_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const id = await Category.createCategory({
            business_id: businessId,
            category_name: category_name.trim(),
            description: description ? description.trim() : null,
            status
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: { id, category_name: category_name.trim(), description, status: status || 'active' }
        });
    } catch (error) {
        console.error("Create Category Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create category"
        });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const categories = await Category.getCategories(businessId);
        return res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error("Get Categories Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch categories"
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const category = await Category.getCategoryById(req.params.id, businessId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error("Get Category By ID Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch category"
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const updated = await Category.updateCategory(req.params.id, businessId, req.body);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Category not found or no changes made"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category updated successfully"
        });
    } catch (error) {
        console.error("Update Category Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update category"
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const deleted = await Category.deleteCategory(req.params.id, businessId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Delete Category Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete category"
        });
    }
};
