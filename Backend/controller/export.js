const Export = require('../models/export');
const Category = require('../models/category');

// Lấy danh sách phiếu xuất (có thể lọc theo category)
const getAll = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
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
        const { category, quantity, unitPrice, exportDate, userName } = req.body;
        if (!category || !quantity || !unitPrice || !exportDate)
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });

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
            userName: userName || 'Admin'
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
// Sửa phiếu xuất (lưu ý: cần cập nhật lại tồn kho nếu quantity hoặc category thay đổi)
const update = async (req, res) => {
    try {
        const { category, quantity, unitPrice, exportDate, userName } = req.body;
        const oldExport = await Export.findById(req.params.id);
        if (!oldExport) return res.status(404).json({ error: 'Không tìm thấy phiếu xuất' });

        // Nếu thay đổi quantity hoặc category thì cập nhật lại tồn kho
        if (category && quantity && (category !== String(oldExport.category) || quantity !== oldExport.quantity)) {
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
            { category, quantity, unitPrice, totalPrice, exportDate, userName: userName || oldExport.userName },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi cập nhật phiếu xuất' });
    }
};

// Xóa phiếu xuất và cộng lại tồn kho
const remove = async (req, res) => {
    try {
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
        res.status(500).json({ error: 'Lỗi xóa phiếu xuất' });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
};