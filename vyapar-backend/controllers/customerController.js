const Customer = require('../model/Customer');

// 1. CREATE CUSTOMER
exports.createCustomer = async (req, res) => {
    try {
        const userId = req.user?.business_id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const {
            customer_name,
            phone,
            email,
            gstin,
            address,
            city,
            state,
            pincode,
            opening_balance,
            bank_name,
            account_number,
            ifsc_code,
            status
        } = req.body;

        if (!customer_name || !customer_name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Customer name is required'
            });
        }

        const trimmedName = customer_name.trim();
        const trimmedPhone = phone ? phone.trim() : null;
        const trimmedEmail = email ? email.trim() : null;
        const trimmedGstin = gstin ? gstin.trim().toUpperCase() : null;
        const trimmedAddress = address ? address.trim() : null;
        const trimmedCity = city ? city.trim() : null;
        const trimmedState = state ? state.trim() : 'Maharashtra';
        const trimmedPincode = pincode ? pincode.trim() : null;
        const trimmedBankName = bank_name ? bank_name.trim() : null;
        const trimmedAccountNumber = account_number ? account_number.trim() : null;
        const trimmedIfscCode = ifsc_code ? ifsc_code.trim().toUpperCase() : null;

        const customerId = await Customer.createCustomer({
            user_id: userId,
            customer_name: trimmedName,
            phone: trimmedPhone,
            email: trimmedEmail,
            gstin: trimmedGstin,
            address: trimmedAddress,
            city: trimmedCity,
            state: trimmedState,
            pincode: trimmedPincode,
            opening_balance: Number(opening_balance) || 0.00,
            bank_name: trimmedBankName,
            account_number: trimmedAccountNumber,
            ifsc_code: trimmedIfscCode,
            status: status || 'active'
        });

        return res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            data: {
                id: customerId,
                user_id: userId,
                customer_name: trimmedName,
                phone: trimmedPhone,
                email: trimmedEmail,
                gstin: trimmedGstin,
                address: trimmedAddress,
                city: trimmedCity,
                state: trimmedState,
                pincode: trimmedPincode,
                opening_balance: Number(opening_balance) || 0.00,
                bank_name: trimmedBankName,
                account_number: trimmedAccountNumber,
                ifsc_code: trimmedIfscCode,
                status: status || 'active'
            }
        });
    } catch (error) {
        console.error('Create Customer Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create customer',
            error: error.message
        });
    }
};

// 2. GET ALL CUSTOMERS
exports.getCustomers = async (req, res) => {
    try {
        const userId = req.user?.business_id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const search = req.query.search || null;
        const customers = await Customer.getCustomers(userId, search);

        return res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        console.error('Get Customers Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            error: error.message
        });
    }
};

// 3. GET CUSTOMER BY ID
exports.getCustomerById = async (req, res) => {
    try {
        const userId = req.user?.business_id || req.user?.id;
        const customerId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!customerId) {
            return res.status(400).json({
                success: false,
                message: 'Customer ID is required'
            });
        }

        const customer = await Customer.getCustomerById(customerId, userId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: `Customer with ID ${customerId} not found`
            });
        }

        return res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('Get Customer By ID Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch customer details',
            error: error.message
        });
    }
};

// 4. UPDATE CUSTOMER
exports.updateCustomer = async (req, res) => {
    try {
        const userId = req.user?.business_id || req.user?.id;
        const customerId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!customerId) {
            return res.status(400).json({
                success: false,
                message: 'Customer ID is required'
            });
        }

        const updated = await Customer.updateCustomer(customerId, req.body, userId);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: `Customer with ID ${customerId} not found or no changes made`
            });
        }

        const updatedCustomer = await Customer.getCustomerById(customerId, userId);

        return res.status(200).json({
            success: true,
            message: 'Customer updated successfully',
            data: updatedCustomer || { id: customerId, ...req.body }
        });
    } catch (error) {
        console.error('Update Customer Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update customer',
            error: error.message
        });
    }
};

// 5. DELETE CUSTOMER
exports.deleteCustomer = async (req, res) => {
    try {
        const userId = req.user?.business_id || req.user?.id;
        const customerId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!customerId) {
            return res.status(400).json({
                success: false,
                message: 'Customer ID is required'
            });
        }

        const deleted = await Customer.deleteCustomer(customerId, userId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: `Customer with ID ${customerId} not found`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Customer deleted successfully',
            deleted_id: customerId
        });
    } catch (error) {
        console.error('Delete Customer Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete customer',
            error: error.message
        });
    }
};
