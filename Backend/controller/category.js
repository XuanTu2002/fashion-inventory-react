const Category = require('../models/category');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Lấy danh sách tất cả danh mục 
const getAll = async (req, res) => {
    try {
        // Kiểm tra và xử lý tham số tìm kiếm an toàn
        const search = typeof req.query.q === 'string' ? req.query.q : '';
        const filter = search
            ? { name: { $regex: search, $options: 'i' } }
            : {};
        const categories = await Category.find(filter).sort({ stock: -1, createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy danh sách danh mục' });
    }
};

// Lấy chi tiết một danh mục
const getOne = async (req, res) => {
    try {
        // Kiểm tra tính hợp lệ của ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }

        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy chi tiết danh mục' });
    }
};

// Thêm mới một danh mục
const create = async (req, res) => {
    try {
        // Kiểm tra và ép kiểu dữ liệu
        const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
        const manufacturer = typeof req.body.manufacturer === 'string' ? req.body.manufacturer.trim() : '';
        const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
        const status = ['active', 'inactive'].includes(req.body.status) ? req.body.status : 'active';
        
        // Kiểm tra dữ liệu bắt buộc
        if (!name || !manufacturer) {
            return res.status(400).json({ error: 'Tên danh mục và nhà cung cấp là bắt buộc' });
        }

        const exist = await Category.findOne({ name, manufacturer });
        if (exist) return res.status(400).json({ error: 'Danh mục đã tồn tại' });

        const category = new Category({
            name,
            manufacturer,
            description,
            status,
            stock: 0
        });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi tạo mới danh mục' });
    }
};

// Sửa danh mục
const update = async (req, res) => {
    try {
        // Kiểm tra tính hợp lệ của ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }

        // Kiểm tra và ép kiểu dữ liệu
        const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
        const manufacturer = typeof req.body.manufacturer === 'string' ? req.body.manufacturer.trim() : '';
        const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
        const status = ['active', 'inactive'].includes(req.body.status) ? req.body.status : 'active';
        
        // Kiểm tra dữ liệu bắt buộc
        if (!name || !manufacturer) {
            return res.status(400).json({ error: 'Tên danh mục và nhà cung cấp là bắt buộc' });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, manufacturer, description, status },
            { new: true }
        );
        if (!category) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi cập nhật danh mục' });
    }
};

// Xóa danh mục
const remove = async (req, res) => {
    try {
        // Kiểm tra tính hợp lệ của ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
        res.json({ message: 'Đã xóa danh mục thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi xóa danh mục' });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
};