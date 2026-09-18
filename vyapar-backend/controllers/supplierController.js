const Supplier = require("../model/Supplier");

// 1. CREATE SUPPLIER
exports.createSupplier = async (req, res) => {
  try {
    const userId = req.user?.business_id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const {
      supplier_name,
      phone,
      email,
      gstin,
      address,
      city,
      state,
      pincode,
      opening_balance,
      status,
    } = req.body;

    if (!supplier_name || !supplier_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Supplier name is required",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!city || !city.trim()) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    if (!state || !state.trim()) {
      return res.status(400).json({
        success: false,
        message: "State is required",
      });
    }

    if (!pincode || !pincode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required",
      });
    }

    const trimmedName = supplier_name.trim();
    const trimmedPhone = phone ? phone.trim() : null;
    const trimmedEmail = email ? email.trim() : null;
    const trimmedGstin = gstin ? gstin.trim() : null;
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim();
    const trimmedState = state.trim();
    const trimmedPincode = pincode.trim();

    // Check for duplicate supplier record using UNIQUE (user_id, gstin) constraint
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
      opening_balance,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: {
        id: supplierId,
        user_id: userId,
        supplier_name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        gstin: trimmedGstin,
        address: trimmedAddress,
        city: trimmedCity,
        state: trimmedState,
        pincode: trimmedPincode,
        opening_balance: opening_balance || 0.0,
        status: status || "active",
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
    const userId = req.user?.business_id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const suppliers = await Supplier.getSuppliers(userId);

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
    const userId = req.user?.business_id || req.user?.id;
    const supplierId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "Supplier ID is required",
      });
    }

    const supplier = await Supplier.getSupplierById(supplierId, userId);

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
    const userId = req.user?.business_id || req.user?.id;
    const nameQuery = req.query.name || req.params.name || "";

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!nameQuery.trim()) {
      return res.status(400).json({
        success: false,
        message: "Supplier name query parameter is required",
      });
    }

    const suppliers = await Supplier.getSuppliersByName(
      nameQuery.trim(),
      userId
    );

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
    const userId = req.user?.business_id || req.user?.id;
    const supplierId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "Supplier ID is required",
      });
    }

    const updated = await Supplier.updateSupplier(supplierId, req.body, userId);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Supplier with ID ${supplierId} not found or no changes made`,
      });
    }

    const updatedSupplier = await Supplier.getSupplierById(supplierId, userId);

    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: updatedSupplier || { id: supplierId, ...req.body },
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
    const userId = req.user?.business_id || req.user?.id;
    const supplierId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "Supplier ID is required",
      });
    }

    const deleted = await Supplier.deleteSupplier(supplierId, userId);

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
