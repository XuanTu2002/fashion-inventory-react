const Import = require('../models/import');
const Category = require('../models/category');

// Lấy danh sách phiếu nhập (có thể lọc theo category)
const getAll = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
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
        const { category, quantity, unitPrice, importDate, userName } = req.body;
        if (!category || !quantity || !unitPrice || !importDate)
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });

        const totalPrice = quantity * unitPrice;

        // Tạo phiếu nhập
        const newImport = new Import({
            category, quantity, unitPrice, totalPrice, importDate, userName: userName || 'Admin'
        });

        await newImport.save();

        // Cập nhật tồn kho cho danh mục
        await Category.findByIdAndUpdate(
            category,
            { $inc: { stock: quantity } }
        );

        res.status(201).json(newImport);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi tạo phiếu nhập' });
    }
};

// Sửa phiếu nhập (lưu ý: cần cập nhật lại tồn kho nếu quantity hoặc category thay đổi)
const update = async (req, res) => {
    try {
        const { category, quantity, unitPrice, importDate, userName } = req.body;
        const oldImport = await Import.findById(req.params.id);
        if (!oldImport) return res.status(404).json({ error: 'Không tìm thấy phiếu nhập' });

        // Nếu thay đổi quantity hoặc category thì cập nhật lại tồn kho
        if (category && quantity && (category !== String(oldImport.category) || quantity !== oldImport.quantity)) {
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
            { category, quantity, unitPrice, totalPrice, importDate, userName: userName || oldImport.userName },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Lỗi cập nhật phiếu nhập' });
    }
};

// Xóa phiếu nhập và trừ tồn kho
const remove = async (req, res) => {
    try {
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
        res.status(500).json({ error: 'Lỗi xóa phiếu nhập' });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
};