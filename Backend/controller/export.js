const Export = require('../models/export');
const Category = require('../models/category');

// Lấy danh sách phiếu xuất (có thể lọc theo category hoặc user)
const getAll = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.user) filter.user = req.query.user;
        const exports = await Export.find(filter)
            .populate('category', 'name manufacturer')
            .populate('user', 'firstName lastName email')
            .sort({ exportDate: -1, createdAt: -1 });
        res.json(exports);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy danh sách phiếu xuất' });
    }
};

// Lấy chi tiết một phiếu xuất
const getOne = async (req, res) => {
    try {
        const exp = await Export.findById(req.params.id)
            .populate('category', 'name manufacturer')
            .populate('user', 'firstName lastName email');
        if (!exp) return res.status(404).json({ error: 'Không tìm thấy phiếu xuất' });
        res.json(exp);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy chi tiết phiếu xuất' });
    }
};

// Tạo mới phiếu xuất
const create = async (req, res) => {
    try {
        const { category, quantity, unitPrice, exportDate, user } = req.body;
        if (!category || !quantity || !unitPrice || !exportDate || !user)
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });

        // Kiểm tra tồn kho đủ xuất không
        const cat = await Category.findById(category);
        if (!cat) return res.status(404).json({ error: 'Không tìm thấy danh mục sản phẩm' });
        
        if (cat.stock < quantity) {
            return res.status(400).json({ error: 'Số lượng tồn kho không đủ để xuất' });
        }
        
        // Tạo phiếu xuất mới
        const newExport = new Export({
            category,
            quantity,
            unitPrice,
            exportDate,
            user
        });
        
        // Lưu phiếu xuất và cập nhật tồn kho
        const savedExport = await newExport.save();
        
        // Giảm số lượng tồn kho
        cat.stock -= quantity;
        await cat.save();
        
        res.status(201).json(savedExport);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi tạo phiếu xuất' });
    }
};

module.exports = {
    getAll,
    getOne,
    create
};