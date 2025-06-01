const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/category');

// Lấy danh sách danh mục
router.get('/', CategoryController.getAll);

// Tìm kiếm danh mục đã được tích hợp vào route getAll qua query parameter

// Lấy chi tiết 1 danh mục
router.get('/:id', CategoryController.getOne);

// Thêm mới danh mục
router.post('/', CategoryController.create);
router.post('/add', CategoryController.create); // Endpoint bổ sung cho frontend

// Sửa danh mục
router.put('/:id', CategoryController.update);

// Xóa danh mục
router.delete('/:id', CategoryController.remove);

module.exports = router;