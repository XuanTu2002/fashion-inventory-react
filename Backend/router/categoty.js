const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category');

// Lấy danh sách danh mục
router.get('/', CategoryController.getAll);

// Tìm kiếm danh mục
router.get('/search', CategoryController.search);

// Lấy chi tiết 1 danh mục
router.get('/:id', CategoryController.getOne);

// Thêm mới danh mục
router.post('/', CategoryController.create);

// Sửa danh mục
router.put('/:id', CategoryController.update);

// Xóa danh mục
router.delete('/:id', CategoryController.remove);

module.exports = router;