const SalesReturn = require('../model/SalesReturn');
const FinancialYear = require('../model/FinancialYear');
const { resolveFinancialYear, assertFYNotLocked } = require('../utils/financialYearHelper');

const getUserId = (req) => {
    return req.user.business_id || req.user.id;
};

// Create Sales Return / Credit Note
exports.createSalesReturn = async (req, res) => {
    try {
        const userId = getUserId(req);
        let fy = await resolveFinancialYear(req, userId);
        if (!fy) {
            fy = await FinancialYear.findOrCreateCurrentFY(userId);
        }
        if (fy) {
            assertFYNotLocked(fy);
        }

        const {
            return_number,
            returnNumber,
            credit_note_number,
            customer_id,
            customer_name,
            customerName,
            customer_phone,
            customerPhone,
            customer_gstin,
            customerGstin,
            customer_state,
            customerState,
            return_date,
            returnDate,
            reason,
            refund_status,
            refundStatus,
            payment_method,
            paymentMethod,
            subtotal,
            tax_amount,
            taxAmount,
            total_amount,
            totalAmount,
            notes,
            items
        } = req.body;

        const retNo = return_number || returnNumber || credit_note_number;
        const custName = customer_name || customerName;
        const retDate = return_date || returnDate || new Date().toISOString().substring(0, 10);
        const retReason = reason || 'Sales Return';
        const refStatus = refund_status || refundStatus || 'Store Credit';
        const payMethod = payment_method || paymentMethod || 'Credit Note';

        if (!custName) {
            return res.status(400).json({
                success: false,
                message: 'Customer name is required'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Credit note must contain at least one line item'
            });
        }

        const fyId = fy ? fy.id : null;
        
        // Auto generate return number if missing
        let finalReturnNo = retNo;
        if (!finalReturnNo) {
            finalReturnNo = await SalesReturn.getNextCreditNoteNumber(userId, fyId);
        } else {
            const exists = await SalesReturn.checkCreditNoteExists(finalReturnNo, userId, fyId);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: `Credit Note / Return Number '${finalReturnNo}' already exists in the active financial year`
                });
            }
        }

        const returnData = {
            user_id: userId,
            financial_year_id: fyId,
            customer_id: customer_id ? Number(customer_id) : null,
            customer_name: custName,
            customer_phone: customer_phone || customerPhone || null,
            customer_gstin: customer_gstin || customerGstin || null,
            customer_state: customer_state || customerState || 'Maharashtra',
            return_number: finalReturnNo,
            invoice_number: null,
            return_date: retDate,
            reason: retReason,
            refund_status: refStatus,
            payment_method: payMethod,
            subtotal: Number(subtotal) || 0,
            tax_amount: Number(tax_amount !== undefined ? tax_amount : (taxAmount || 0)),
            total_amount: Number(total_amount !== undefined ? total_amount : (totalAmount || 0)),
            notes: notes || null
        };

        const returnId = await SalesReturn.createSalesReturn(returnData, items);

        return res.status(201).json({
            success: true,
            message: 'Credit Note / Sales Return created successfully',
            data: {
                id: returnId,
                ...returnData,
                items
            }
        });

    } catch (error) {
        console.error('Create Sales Return Error:', error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal server error while creating sales return'
        });
    }
};

// Get All Sales Returns
exports.getSalesReturns = async (req, res) => {
    try {
        const userId = getUserId(req);
        let fy = null;
        let fyId = null;

        if (req.query?.financial_year_id && req.query.financial_year_id !== 'ALL') {
            fyId = Number(req.query.financial_year_id);
        } else if (req.query?.financial_year_id !== 'ALL' && req.query?.all !== 'true') {
            fy = await resolveFinancialYear(req, userId);
            if (fy) fyId = fy.id;
        }

        const returns = await SalesReturn.getSalesReturns(userId, fyId);

        return res.status(200).json({
            success: true,
            count: returns.length,
            financialYear: fy ? { id: fy.id, fy_name: fy.fy_name, fy_code: fy.fy_code } : null,
            data: returns
        });
    } catch (error) {
        console.error('Get Sales Returns Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while fetching sales returns'
        });
    }
};

// Get Sales Return By ID
exports.getSalesReturnById = async (req, res) => {
    try {
        const userId = getUserId(req);
        const returnId = req.params.id;

        if (!returnId) {
            return res.status(400).json({
                success: false,
                message: 'Return ID is required'
            });
        }

        const returnRecord = await SalesReturn.getSalesReturnById(returnId, userId);

        if (!returnRecord) {
            return res.status(404).json({
                success: false,
                message: 'Credit Note / Sales Return not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: returnRecord
        });
    } catch (error) {
        console.error('Get Sales Return By ID Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while fetching sales return'
        });
    }
};

// Delete Sales Return
exports.deleteSalesReturn = async (req, res) => {
    try {
        const userId = getUserId(req);
        const returnId = req.params.id || req.body?.id || req.body?.return_id || req.query?.return_number || req.body?.return_number;
        const returnNumber = req.query?.return_number || req.body?.return_number || null;

        if (!returnId && !returnNumber) {
            return res.status(400).json({
                success: false,
                message: 'Return ID or Credit Note number is required for deletion'
            });
        }

        const deleted = await SalesReturn.deleteSalesReturn(returnId, userId, returnNumber);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Credit Note not found or already deleted'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Credit Note deleted successfully'
        });
    } catch (error) {
        console.error('Delete Sales Return Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while deleting sales return'
        });
    }
};

// Get Next Credit Note Number
exports.getNextCreditNoteNumber = async (req, res) => {
    try {
        const userId = getUserId(req);
        const fy = await resolveFinancialYear(req, userId);
        const nextNumber = await SalesReturn.getNextCreditNoteNumber(userId, fy ? fy.id : null);

        return res.status(200).json({
            success: true,
            return_number: nextNumber,
            credit_note_number: nextNumber
        });
    } catch (error) {
        console.error('Get Next Credit Note Number Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while generating credit note number'
        });
    }
};
