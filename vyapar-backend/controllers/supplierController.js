const Supplier = require("../model/Supplier");

// 1. CREATE SUPPLIER
exports.createSupplier = async (req, res) => {
  try {
    const userId = req.user?.business_id || req.user?.id || 1;

    const rawName = req.body?.supplier_name || req.body?.name;
    const rawPhone = req.body?.phone || req.body?.mobile;
    const rawEmail = req.body?.email;
    const rawGstin = req.body?.gstin;
    const rawAddress = req.body?.address || '';
    const rawCity = req.body?.city || '';
    const rawState = req.body?.state || '';
    const rawPincode = req.body?.pincode || '';
    const rawOpeningBalance = req.body?.opening_balance !== undefined ? req.body?.opening_balance : req.body?.openingBalance;
    const rawStatus = req.body?.status || 'active';

    if (!rawName || !rawName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Supplier name is required",
      });
    }

    const trimmedName = rawName.trim();
    const trimmedPhone = rawPhone ? rawPhone.trim() : null;
    const trimmedEmail = rawEmail ? rawEmail.trim() : null;
    const trimmedGstin = rawGstin && rawGstin.trim() ? rawGstin.trim() : null;
    const trimmedAddress = rawAddress ? rawAddress.trim() : '';
    const trimmedCity = rawCity ? rawCity.trim() : '';
    const trimmedState = rawState ? rawState.trim() : '';
    const trimmedPincode = rawPincode ? rawPincode.trim() : '';

    // Check for duplicate supplier record if GSTIN is provided
    if (trimmedGstin) {
      const duplicateSupplier = await Supplier.findDuplicateSupplier({
        user_id: userId,
        gstin: trimmedGstin,
      });

      if (duplicateSupplier) {
        return res.status(409).json({
          success: false,
          message: `Supplier with GSTIN '${trimmedGstin}' already exists`,
          duplicate_record: {
            id: duplicateSupplier.id,
            supplier_name: duplicateSupplier.supplier_name,
            gstin: duplicateSupplier.gstin,
            phone: duplicateSupplier.phone,
            email: duplicateSupplier.email,
          },
        });
      }
    }

    const supplierId = await Supplier.createSupplier({
      user_id: userId,
      supplier_name: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      gstin: trimmedGstin,
      address: trimmedAddress,
      city: trimmedCity,
      state: trimmedState,
      pincode: trimmedPincode,
      opening_balance: Number(rawOpeningBalance) || 0.0,
      status: rawStatus,
    });

    const createdSupplier = await Supplier.getSupplierById(supplierId);

    return res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: createdSupplier || {
        id: supplierId,
        user_id: userId,
        supplier_name: trimmedName,
        name: trimmedName,
        phone: trimmedPhone,
        mobile: trimmedPhone,
        email: trimmedEmail,
        gstin: trimmedGstin,
        address: trimmedAddress,
        city: trimmedCity,
        state: trimmedState,
        pincode: trimmedPincode,
        opening_balance: Number(rawOpeningBalance) || 0.0,
        openingBalance: Number(rawOpeningBalance) || 0.0,
        current_payable: 0,
        currentPayable: 0,
        status: rawStatus,
      },
    });
  } catch (error) {
    console.error("Create Supplier Error:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: "Supplier record already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create supplier",
      error: error.message,
    });
  }
};

// 2. GET ALL SUPPLIERS
exports.getSuppliers = async (req, res) => {
  try {
    const userId = req.user?.business_id || req.user?.id || 1;
    const search = req.query?.search || req.query?.q || req.query?.name || '';

    const suppliers = await Supplier.getSuppliers(userId, search);

    return res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });

  } catch (error) {
    console.error("Get Suppliers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch suppliers",
      error: error.message,
    });
  }
};

// 3. GET SUPPLIER BY ID
exports.getSupplierById = async (req, res) => {
   try {
    const supplierId = req.params.id;

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "Supplier ID is required",
      });
    }

    const supplier = await Supplier.getSupplierById(supplierId);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: `Supplier with ID ${supplierId} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: supplier,
    });

  } catch (error) {
    console.error("Get Supplier By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch supplier details",
      error: error.message,
    });
  }
};

// 4. GET SUPPLIER BY NAME (Keyword Search)
exports.getSupplierByName = async (req, res) => {
  try {
    const nameQuery = req.query.name || req.params.name || "";

    if (!nameQuery.trim()) {
      return res.status(400).json({
        success: false,
        message: "Supplier name query parameter is required",
      });
    }

    const suppliers = await Supplier.getSuppliersByName(nameQuery.trim());

    return res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });

  } catch (error) {
    console.error("Get Supplier By Name Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search suppliers by name",
      error: error.message,
    });
  }
};

// 5. UPDATE SUPPLIER BY ID
exports.updateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "Supplier ID is required",
      });
    }

    const rawBody = req.body || {};
    const normalizedBody = {
      supplier_name: rawBody.supplier_name || rawBody.name,
      phone: rawBody.phone || rawBody.mobile,
      email: rawBody.email,
      gstin: rawBody.gstin && rawBody.gstin.trim() ? rawBody.gstin.trim() : null,
      address: rawBody.address,
      city: rawBody.city,
      state: rawBody.state,
      pincode: rawBody.pincode,
      opening_balance: rawBody.opening_balance !== undefined ? rawBody.opening_balance : rawBody.openingBalance,
      status: rawBody.status
    };

    await Supplier.updateSupplier(supplierId, normalizedBody);

    const updatedSupplier = await Supplier.getSupplierById(supplierId);

    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: updatedSupplier || { id: supplierId, ...normalizedBody },
    });
  } catch (error) {
    console.error("Update Supplier Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update supplier",
      error: error.message,
    });
  }
};

// 6. DELETE SUPPLIER BY ID
exports.deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "Supplier ID is required",
      });
    }

    const deleted = await Supplier.deleteSupplier(supplierId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Supplier with ID ${supplierId} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
      deleted_id: supplierId,
    });
  } catch (error) {
    console.error("Delete Supplier Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete supplier",
      error: error.message,
    });
  }
};
