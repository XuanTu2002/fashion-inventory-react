const Import = require('../models/import');
const Category = require('../models/category');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Lấy danh sách phiếu nhập
const getAll = async (req, res) => {
    try {
        const filter = {};
        const search = typeof req.query.q === 'string' ? req.query.q : '';

        if (req.query.category && ObjectId.isValid(req.query.category)) {
            filter.category = new ObjectId(req.query.category);
        }

        if (search) {
            const matchingCategories = await Category.find({
                name: { $regex: search, $options: 'i' }
            }).select('_id');

            const categoryIds = matchingCategories.map(cat => cat._id);

            if (categoryIds.length > 0) {
                filter.category = { $in: categoryIds };
            } else {
                return res.json([]);
            }
        }
        const imports = await Import.find(filter)
            .populate('category', 'name manufacturer')
            .sort({ importDate: -1, createdAt: -1 });
        res.json(imports);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy danh sách phiếu nhập' });
    }
};

// Lấy chi tiết một phiếu nhập
const getOne = async (req, res) => {
    try {
        // Kiểm tra tính hợp lệ của ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }

        const imp = await Import.findById(req.params.id)
            .populate('category', 'name manufacturer');
        if (!imp) return res.status(404).json({ error: 'Không tìm thấy phiếu nhập' });
        res.json(imp);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy chi tiết phiếu nhập' });
    }
};

// Tạo mới phiếu nhập
const create = async (req, res) => {
    try {
        // Kiểm tra và ép kiểu dữ liệu đầu vào
        // Kiểm tra category phải là ObjectId hợp lệ
        if (!req.body.category || !ObjectId.isValid(req.body.category)) {
            return res.status(400).json({ error: 'Danh mục không hợp lệ' });
        }
        const category = new ObjectId(req.body.category);

        // Kiểm tra quantity và unitPrice phải là số dương
        const quantity = parseInt(req.body.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'Số lượng phải là số nguyên dương' });
        }

        const unitPrice = parseFloat(req.body.unitPrice);
        if (isNaN(unitPrice) || unitPrice <= 0) {
            return res.status(400).json({ error: 'Giá nhập phải là số dương' });
        }

        // Kiểm tra importDate phải là ngày hợp lệ
        const importDate = new Date(req.body.importDate);
        if (importDate.toString() === 'Invalid Date') {
            return res.status(400).json({ error: 'Ngày nhập không hợp lệ' });
        }

        // Kiểm tra userName nếu có
        const userName = typeof req.body.userName === 'string' ? req.body.userName.trim() : 'Admin';

        const totalPrice = quantity * unitPrice;

        // Tạo phiếu nhập
        const newImport = new Import({
            category, quantity, unitPrice, totalPrice, importDate, userName
        });

        await newImport.save();

        // Cập nhật tồn kho cho danh mục
        await Category.findByIdAndUpdate(
            category,
            { $inc: { stock: quantity } }
        );

        res.status(201).json(newImport);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi tạo phiếu nhập: ' + err.message });
    }
};

// Sửa phiếu nhập (lưu ý: cần cập nhật lại tồn kho nếu quantity hoặc category thay đổi)
const update = async (req, res) => {
    try {
        // Kiểm tra tính hợp lệ của ID
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }

        // Tìm phiếu nhập cũ
        const oldImport = await Import.findById(req.params.id);
        if (!oldImport) return res.status(404).json({ error: 'Không tìm thấy phiếu nhập' });

        // Kiểm tra và ép kiểu dữ liệu đầu vào
        // Kiểm tra category nếu có
        let category = oldImport.category;
        if (req.body.category) {
            if (!ObjectId.isValid(req.body.category)) {
                return res.status(400).json({ error: 'Danh mục không hợp lệ' });
            }
            category = new ObjectId(req.body.category);
        }

        // Kiểm tra quantity nếu có
        let quantity = oldImport.quantity;
        if (req.body.quantity !== undefined) {
            quantity = parseInt(req.body.quantity);
            if (isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ error: 'Số lượng phải là số nguyên dương' });
            }
        }

        // Kiểm tra unitPrice nếu có
        let unitPrice = oldImport.unitPrice;
        if (req.body.unitPrice !== undefined) {
            unitPrice = parseFloat(req.body.unitPrice);
            if (isNaN(unitPrice) || unitPrice <= 0) {
                return res.status(400).json({ error: 'Giá nhập phải là số dương' });
            }
        }

        // Kiểm tra importDate nếu có
        let importDate = oldImport.importDate;
        if (req.body.importDate) {
            importDate = new Date(req.body.importDate);
            if (importDate.toString() === 'Invalid Date') {
                return res.status(400).json({ error: 'Ngày nhập không hợp lệ' });
            }
        }

        // Kiểm tra userName nếu có
        const userName = typeof req.body.userName === 'string' ? req.body.userName.trim() : oldImport.userName;

        // Nếu thay đổi quantity hoặc category thì cập nhật lại tồn kho
        if (!category.equals(oldImport.category) || quantity !== oldImport.quantity) {
            // Trả lại tồn kho cũ
            await Category.findByIdAndUpdate(
                oldImport.category,
                { $inc: { stock: -oldImport.quantity } }
            );
            // Cộng tồn kho mới
            await Category.findByIdAndUpdate(
                category,
                { $inc: { stock: quantity } }
            );
        }

        const totalPrice = quantity * unitPrice;

        const updated = await Import.findByIdAndUpdate(
            req.params.id,
            { category, quantity, unitPrice, totalPrice, importDate, userName },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi cập nhật phiếu nhập: ' + err.message });
    }
};

// Xóa phiếu nhập và trừ tồn kho
const remove = async (req, res) => {
    try {
        // Kiểm tra tính hợp lệ của ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }

        const oldImport = await Import.findById(req.params.id);
        if (!oldImport) return res.status(404).json({ error: 'Không tìm thấy phiếu nhập' });

        // Trừ tồn kho
        await Category.findByIdAndUpdate(
            oldImport.category,
            { $inc: { stock: -oldImport.quantity } }
        );

        await Import.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa phiếu nhập' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi xóa phiếu nhập: ' + err.message });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
};