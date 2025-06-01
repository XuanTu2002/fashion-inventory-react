const express = require('express');
const router = express.Router();
const exportController = require('../controller/export');

// Lấy danh sách phiếu xuất (có thể lọc theo category hoặc user)
router.get('/', exportController.getAll);

// Lấy chi tiết một phiếu xuất
router.get('/:id', exportController.getOne);

// Tạo mới phiếu xuất
router.post('/', exportController.create);

// Sửa phiếu xuất
router.put('/:id', exportController.update);

// Xóa phiếu xuất
router.delete('/:id', exportController.remove)

module.exports = router;