const Category = require('../model/Category');

const getBusinessId = (req) => {
    return req.user?.business_id || req.user?.id || 1;
};

exports.getCategories = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const search = req.query?.search || req.query?.q || req.query?.name || '';
        const categories = await Category.getCategories(businessId, search);

        return res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch categories'
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.getCategoryById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch category'
        });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const businessId = getBusinessId(req);

        const rawName = req.body?.category_name || req.body?.name || req.body?.categoryName;
        const rawDesc = req.body?.description || req.body?.desc;
        const rawStatus = req.body?.status || 'active';

        if (!rawName || !String(rawName).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const categoryId = await Category.createCategory({
            business_id: businessId,
            category_name: String(rawName).trim(),
            description: rawDesc ? String(rawDesc).trim() : null,
            status: rawStatus
        });

        const category = await Category.getCategoryById(categoryId);

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category || {
                id: categoryId,
                business_id: businessId,
                category_name: String(rawName).trim(),
                description: rawDesc || null,
                status: rawStatus
            }
        });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create category'
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const businessId = getBusinessId(req);
        const categoryId = req.params.id;

        const rawName = req.body?.category_name || req.body?.name || req.body?.categoryName;
        const rawDesc = req.body?.description || req.body?.desc;
        const rawStatus = req.body?.status;

        const updated = await Category.updateCategory(categoryId, businessId, {
            category_name: rawName ? String(rawName).trim() : null,
            description: rawDesc !== undefined ? String(rawDesc).trim() : undefined,
            status: rawStatus
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or update failed'
            });
        }

        const category = await Category.getCategoryById(categoryId);

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update category'
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const deleted = await Category.deleteCategory(categoryId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or deletion failed'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete category'
        });
    }
};
