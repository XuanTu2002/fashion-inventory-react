const Category = require('../models/category');

// Lấy danh sách tất cả danh mục 
const getAll = async (req, res) => {
    try {
        const search = req.query.q || '';
        const filter = search
            ? { name: { $regex: search, $options: 'i' } }
            : {};
        const categories = await Category.find(filter).sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy danh sách danh mục' });
    }
};

// Lấy chi tiết một danh mục
const getOne = async (req, res) => {
    try {
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
        const { name, manufacturer, description, status } = req.body;
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
        const { name, manufacturer, description, status } = req.body;
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