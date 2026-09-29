const PurchaseReturn = require('../model/PurchaseReturn');
const FinancialYear = require('../model/FinancialYear');
const { resolveFinancialYear, assertFYNotLocked } = require('../utils/financialYearHelper');

const getUserId = (req) => {
    return req.user.business_id || req.user.id;
};

// Create Purchase Return (Debit Note)
exports.createPurchaseReturn = async (req, res) => {
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
            supplier_id,
            supplier_name,
            supplierName,
            supplier_phone,
            supplierPhone,
            supplier_state,
            supplierState,
            supplier_gstin,
            supplierGstin,
            debit_note_number,
            debitNoteNumber,
            original_invoice_number,
            originalInvoiceNumber,
            return_date,
            returnDate,
            return_reason,
            returnReason,
            refund_status,
            refundStatus,
            payment_method,
            subtotal,
            total_discounts,
            totalDiscounts,
            total_taxable,
            totalTaxable,
            total_gst,
            totalGst,
            grand_total,
            grandTotal,
            notes,
            items
        } = req.body;

        const dnNo = debit_note_number || debitNoteNumber;
        const origInvNo = original_invoice_number || originalInvoiceNumber || '';
        const retDate = return_date || returnDate || new Date().toISOString().substring(0, 10);
        const retReason = return_reason || returnReason || 'Return to Supplier';
        const refStatus = refund_status || refundStatus || 'Refund Pending';
        const supName = supplier_name || supplierName;

        if (!dnNo) {
            return res.status(400).json({
                success: false,
                message: 'Debit Note number is required'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Purchase return must contain at least one line item'
            });
        }

        const fyId = fy ? fy.id : null;
        const exists = await PurchaseReturn.checkDebitNoteExists(dnNo, userId, fyId);
        if (exists) {
            return res.status(409).json({
                success: false,
                message: `Debit Note '${dnNo}' already exists in current financial year`
            });
        }

        const returnData = {
            user_id: userId,
            financial_year_id: fyId,
            supplier_id: supplier_id ? Number(supplier_id) : null,
            supplier_name: supName || null,
            supplier_phone: supplier_phone || supplierPhone || null,
            supplier_state: supplier_state || supplierState || null,
            supplier_gstin: supplier_gstin || supplierGstin || null,
            debit_note_number: dnNo,
            original_invoice_number: origInvNo,
            return_date: retDate,
            return_reason: retReason,
            refund_status: refStatus,
            payment_method: payment_method || 'Debit Note',
            subtotal: Number(subtotal) || 0,
            total_discounts: Number(total_discounts !== undefined ? total_discounts : (totalDiscounts || 0)),
            total_taxable: Number(total_taxable !== undefined ? total_taxable : (totalTaxable || 0)),
            total_gst: Number(total_gst !== undefined ? total_gst : (totalGst || 0)),
            grand_total: Number(grand_total !== undefined ? grand_total : (grandTotal || 0)),
            notes: notes || null
        };

        const returnId = await PurchaseReturn.createPurchaseReturn(returnData, items);

        return res.status(201).json({
            success: true,
            message: 'Purchase Return (Debit Note) created successfully',
            data: {
                id: returnId,
                ...returnData,
                items
            }
        });

    } catch (error) {
        console.error('Create Purchase Return Error:', error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal server error while creating purchase return'
        });
    }
};

// Get All Purchase Returns
exports.getPurchaseReturns = async (req, res) => {
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

        const returns = await PurchaseReturn.getPurchaseReturns(userId, fyId);

        return res.status(200).json({
            success: true,
            count: returns.length,
            financialYear: fy ? { id: fy.id, fy_name: fy.fy_name, fy_code: fy.fy_code } : null,
            data: returns
        });
    } catch (error) {
        console.error('Get Purchase Returns Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while fetching purchase returns'
        });
    }
};

// Get Purchase Return by ID
exports.getPurchaseReturnById = async (req, res) => {
    try {
        const userId = getUserId(req);
        const returnId = req.params.id;

        if (!returnId) {
            return res.status(400).json({
                success: false,
                message: 'Return ID is required'
            });
        }

        const record = await PurchaseReturn.getPurchaseReturnById(returnId, userId);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Purchase Return record not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: record
        });
    } catch (error) {
        console.error('Get Purchase Return By ID Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while fetching purchase return'
        });
    }
};

// Update Purchase Return
exports.updatePurchaseReturn = async (req, res) => {
    try {
        const userId = getUserId(req);
        const {
            id,
            return_id,
            returnId,
            supplier_id,
            supplier_name,
            supplierName,
            debit_note_number,
            debitNoteNumber,
            original_invoice_number,
            originalInvoiceNumber,
            return_date,
            returnDate,
            return_reason,
            returnReason,
            refund_status,
            refundStatus,
            subtotal,
            total_discounts,
            totalDiscounts,
            total_taxable,
            totalTaxable,
            total_gst,
            totalGst,
            grand_total,
            grandTotal,
            notes,
            items
        } = req.body;

        const targetId = id || return_id || returnId;
        if (!targetId) {
            return res.status(400).json({
                success: false,
                message: 'Return ID is required for update'
            });
        }

        const dnNo = debit_note_number || debitNoteNumber;
        const origInvNo = original_invoice_number || originalInvoiceNumber || '';
        const retDate = return_date || returnDate || new Date().toISOString().substring(0, 10);
        const retReason = return_reason || returnReason || 'Return to Supplier';
        const refStatus = refund_status || refundStatus || 'Refund Pending';
        const supName = supplier_name || supplierName;

        if (!dnNo) {
            return res.status(400).json({
                success: false,
                message: 'Debit Note number is required'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one return item is required'
            });
        }

        await PurchaseReturn.updatePurchaseReturn(
            targetId,
            userId,
            {
                supplier_id: supplier_id ? Number(supplier_id) : null,
                supplier_name: supName || null,
                debit_note_number: dnNo,
                original_invoice_number: origInvNo,
                return_date: retDate,
                return_reason: retReason,
                refund_status: refStatus,
                subtotal: Number(subtotal) || 0,
                total_discounts: Number(total_discounts !== undefined ? total_discounts : (totalDiscounts || 0)),
                total_taxable: Number(total_taxable !== undefined ? total_taxable : (totalTaxable || 0)),
                total_gst: Number(total_gst !== undefined ? total_gst : (totalGst || 0)),
                grand_total: Number(grand_total !== undefined ? grand_total : (grandTotal || 0)),
                notes: notes || null
            },
            items
        );

        return res.status(200).json({
            success: true,
            message: 'Purchase Return updated successfully'
        });

    } catch (error) {
        console.error('Update Purchase Return Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while updating purchase return'
        });
    }
};

// Delete Purchase Return / Debit Note
exports.deletePurchaseReturn = async (req, res) => {
    try {
        const userId = getUserId(req);
        const returnId = req.params?.id || req.body?.id || req.body?.return_id || req.query?.id || req.query?.debit_note_number || req.body?.debit_note_number;
        const debitNoteNo = req.query?.debit_note_number || req.body?.debit_note_number || null;

        if (!returnId && !debitNoteNo) {
            return res.status(400).json({
                success: false,
                message: 'Return ID or Debit Note number is required for deletion'
            });
        }

        const deleted = await PurchaseReturn.deletePurchaseReturn(returnId, userId, debitNoteNo);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Debit Note not found or already deleted'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Debit Note deleted successfully'
        });

    } catch (error) {
        console.error('Delete Purchase Return Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while deleting purchase return'
        });
    }
};

// Get Next Debit Note Number
exports.getNextDebitNoteNumber = async (req, res) => {
    try {
        const userId = getUserId(req);
        const fy = await resolveFinancialYear(req, userId);
        const nextNumber = await PurchaseReturn.getNextDebitNoteNumber(userId, fy ? fy.id : null);

        return res.status(200).json({
            success: true,
            debit_note_number: nextNumber,
            return_number: nextNumber
        });
    } catch (error) {
        console.error('Get Next Debit Note Number Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while generating debit note number'
        });
    }
};
