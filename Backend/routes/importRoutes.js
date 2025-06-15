const express = require('express');
const router = express.Router();
const importController = require('../controllers/importController');

// Lấy danh sách phiếu nhập (có thể lọc theo category hoặc user qua query)
router.get('/', importController.getAll);

// Lấy chi tiết một phiếu nhập
router.get('/:id', importController.getOne);

// Tạo mới phiếu nhập
router.post('/', importController.create);

// Sửa phiếu nhập
router.put('/:id', importController.update);

// Xóa phiếu nhập
router.delete('/:id', importController.remove);

module.exports = router;