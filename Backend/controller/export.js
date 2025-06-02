const Export = require('../models/export');
const Category = require('../models/category');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Lấy danh sách phiếu xuất (có thể lọc theo category)
const getAll = async (req, res) => {
    try {
        const filter = {};
        // Kiểm tra tính hợp lệ của category ObjectId nếu có
        if (req.query.category && ObjectId.isValid(req.query.category)) {
            filter.category = new ObjectId(req.query.category);
        }
        const exports = await Export.find(filter)
            .populate('category', 'name manufacturer')
            .sort({ exportDate: -1, createdAt: -1 });
        res.json(exports);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy danh sách phiếu xuất' });
    }
};

// Lấy chi tiết một phiếu xuất
const getOne = async (req, res) => {
    try {
        // Kiểm tra tính hợp lệ của ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }

        const exp = await Export.findById(req.params.id)
            .populate('category', 'name manufacturer');
        if (!exp) return res.status(404).json({ error: 'Không tìm thấy phiếu xuất' });
        res.json(exp);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy chi tiết phiếu xuất' });
    }
};

// Tạo mới phiếu xuất
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
            return res.status(400).json({ error: 'Giá xuất phải là số dương' });
        }
        
        // Kiểm tra exportDate phải là ngày hợp lệ
        const exportDate = new Date(req.body.exportDate);
        if (exportDate.toString() === 'Invalid Date') {
            return res.status(400).json({ error: 'Ngày xuất không hợp lệ' });
        }
        
        // Kiểm tra userName nếu có
        const userName = typeof req.body.userName === 'string' ? req.body.userName.trim() : 'Admin';

        // Kiểm tra tồn kho đủ xuất không
        const cat = await Category.findById(category);
        if (!cat) return res.status(404).json({ error: 'Không tìm thấy danh mục sản phẩm' });
        
        if (cat.stock < quantity) {
            return res.status(400).json({ error: 'Số lượng tồn kho không đủ để xuất' });
        }
        
        const totalPrice = quantity * unitPrice;
        
        // Tạo phiếu xuất mới
        const newExport = new Export({
            category,
            quantity,
            unitPrice,
            totalPrice,
            exportDate,
            userName
        });
        
        // Lưu phiếu xuất và cập nhật tồn kho
        const savedExport = await newExport.save();
        
        // Giảm số lượng tồn kho
        cat.stock -= quantity;
        await cat.save();
        
        res.status(201).json(savedExport);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi tạo phiếu xuất: ' + err.message });
    }
};
// Sửa phiếu xuất (lưu ý: cần cập nhật lại tồn kho nếu quantity hoặc category thay đổi)
const update = async (req, res) => {
    try {
        // Kiểm tra tính hợp lệ của ID
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }
        
        // Tìm phiếu xuất cũ
        const oldExport = await Export.findById(req.params.id);
        if (!oldExport) return res.status(404).json({ error: 'Không tìm thấy phiếu xuất' });

        // Kiểm tra và ép kiểu dữ liệu đầu vào
        // Kiểm tra category nếu có
        let category = oldExport.category;
        if (req.body.category) {
            if (!ObjectId.isValid(req.body.category)) {
                return res.status(400).json({ error: 'Danh mục không hợp lệ' });
            }
            category = new ObjectId(req.body.category);
        }
        
        // Kiểm tra quantity nếu có
        let quantity = oldExport.quantity;
        if (req.body.quantity !== undefined) {
            quantity = parseInt(req.body.quantity);
            if (isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ error: 'Số lượng phải là số nguyên dương' });
            }
        }
        
        // Kiểm tra unitPrice nếu có
        let unitPrice = oldExport.unitPrice;
        if (req.body.unitPrice !== undefined) {
            unitPrice = parseFloat(req.body.unitPrice);
            if (isNaN(unitPrice) || unitPrice <= 0) {
                return res.status(400).json({ error: 'Giá xuất phải là số dương' });
            }
        }
        
        // Kiểm tra exportDate nếu có
        let exportDate = oldExport.exportDate;
        if (req.body.exportDate) {
            exportDate = new Date(req.body.exportDate);
            if (exportDate.toString() === 'Invalid Date') {
                return res.status(400).json({ error: 'Ngày xuất không hợp lệ' });
            }
        }
        
        // Kiểm tra userName nếu có
        const userName = typeof req.body.userName === 'string' ? req.body.userName.trim() : oldExport.userName;

        // Nếu thay đổi quantity hoặc category thì cập nhật lại tồn kho
        if (!category.equals(oldExport.category) || quantity !== oldExport.quantity) {
            // Trả lại tồn kho cũ
            await Category.findByIdAndUpdate(
                oldExport.category,
                { $inc: { stock: oldExport.quantity } }
            );
            
            // Kiểm tra tồn kho đủ xuất không
            const cat = await Category.findById(category);
            if (!cat) return res.status(404).json({ error: 'Không tìm thấy danh mục sản phẩm' });
            
            if (cat.stock < quantity) {
                return res.status(400).json({ error: 'Số lượng tồn kho không đủ để xuất' });
            }
            
            // Trừ tồn kho mới
            await Category.findByIdAndUpdate(
                category,
                { $inc: { stock: -quantity } }
            );
        }

        const totalPrice = quantity * unitPrice;

        const updated = await Export.findByIdAndUpdate(
            req.params.id,
            { category, quantity, unitPrice, totalPrice, exportDate, userName },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi cập nhật phiếu xuất: ' + err.message });
    }
};

// Xóa phiếu xuất và cộng lại tồn kho
const remove = async (req, res) => {
    try {
        // Kiểm tra tính hợp lệ của ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }

        const oldExport = await Export.findById(req.params.id);
        if (!oldExport) return res.status(404).json({ error: 'Không tìm thấy phiếu xuất' });

        // Cộng lại tồn kho
        await Category.findByIdAndUpdate(
            oldExport.category,
            { $inc: { stock: oldExport.quantity } }
        );

        await Export.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa phiếu xuất' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi xóa phiếu xuất: ' + err.message });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
};