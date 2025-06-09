import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Pagination from "../components/Pagination";
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast, showConfirmToast } from "../components/Toast";

function Category() {
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateCategory, setUpdateCategory] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [updatePage, setUpdatePage] = useState(true);
  const [newCategory, setNewCategory] = useState({
    name: "",
    manufacturer: "",
    description: "",
    status: "active"
  });

  const authContext = useContext(AuthContext);
  console.log('====================================');
  console.log(authContext);
  console.log('====================================');

  useEffect(() => {
    fetchCategoriesData();
  }, [updatePage]);

  // Fetching Data of All Categories
  const fetchCategoriesData = () => {
    fetch(`http://localhost:4000/api/category`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of Search Categories
  const fetchSearchData = () => {
    fetch(`http://localhost:4000/api/category?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Dữ liệu nhận được từ server:', data);
        setCategories(data);
      })
      .catch((err) => console.log(err));
  };

  // Modal for Category ADD
  const addCategoryModalSetting = () => {
    setShowCategoryModal(!showCategoryModal);
  };

  // Modal for Category UPDATE
  const updateCategoryModalSetting = (selectedCategoryData) => {
    console.log("Clicked: edit");
    setUpdateCategory(selectedCategoryData);
    setShowUpdateModal(!showUpdateModal);
  };


  // Delete category
  const deleteCategory = (id) => {
    showConfirmToast(
      'Bạn có chắc muốn xóa danh mục này không?',
      () => {
        fetch(`http://localhost:4000/api/category/${id}`, {
          method: "DELETE"
        })
          .then((response) => response.json())
          .then((data) => {
            showSuccessToast('Đã xóa danh mục thành công');
            setUpdatePage(!updatePage);
          })
          .catch((err) => {
            showErrorToast('Lỗi khi xóa danh mục: ' + (err.message || 'Không thể kết nối với máy chủ'));
            console.log(err);
          });
      }
    );
  };

  // Add new category
  const addCategory = () => {
    // Validate required fields
    if (!newCategory.name || !newCategory.manufacturer) {
      showWarningToast("Vui lòng điền tên danh mục và nhà cung cấp");
      return;
    }
    fetch(`http://localhost:4000/api/category/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newCategory,
        userId: authContext.user
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || "Lỗi khi tạo danh mục"); });
        }
        return response.json();
      })
      .then((data) => {
        showSuccessToast("Đã thêm danh mục thành công");
        setUpdatePage(!updatePage);
        setShowCategoryModal(false);
        // Reset form
        setNewCategory({
          name: "",
          manufacturer: "",
          description: "",
          status: "active"
        });
      })
      .catch((err) => {
        showErrorToast(err.message || "Lỗi khi tạo danh mục");
        console.log(err);
      });
  };

  // Update category
  const saveUpdatedCategory = () => {
    // Validate required fields
    if (!updateCategory.name || !updateCategory.manufacturer) {
      alert("Vui lòng điền tên danh mục và nhà cung cấp");
      return;
    }

    fetch(`http://localhost:4000/api/category/${updateCategory._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateCategory),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || "Lỗi khi cập nhật danh mục"); });
        }
        return response.json();
      })
      .then((data) => {
        showSuccessToast("Đã cập nhật danh mục thành công");
        setUpdatePage(!updatePage);
        setShowUpdateModal(false);
      })
      .catch((err) => {
        showErrorToast(err.message || "Lỗi khi cập nhật danh mục");
        console.log(err);
      });
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    fetchSearchData();
  };

  // Tính toán danh mục cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Tính số trang
  const pageCount = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-2">
          <span className="font-semibold px-2 text-sm">Quản lý danh mục hàng hóa</span>
          <div className="flex flex-row justify-center items-center">
            <div className="flex flex-col p-2 w-full md:w-1/4">
              <span className="font-semibold text-blue-600 text-xs">
                Tổng danh mục
              </span>
              <span className="font-semibold text-gray-600 text-xs">
                {categories.length}
              </span>
              <span className="font-thin text-gray-400 text-xs text-[10px]">
                Danh mục
              </span>
            </div>
            <div className="flex flex-col gap-1 p-2 w-full md:w-1/4 sm:border-y md:border-x md:border-y-0">
              <span className="font-semibold text-yellow-600 text-xs">
                Danh mục tồn kho cao
              </span>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-xs">
                    {categories.filter(cat => cat.stock > 100).length}
                  </span>
                  <span className="font-thin text-gray-400 text-[10px]">
                    Danh mục
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-2 w-full md:w-1/4 sm:border-y md:border-x md:border-y-0">
              <span className="font-semibold text-purple-600 text-xs">
                Tình trạng danh mục
              </span>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-xs">
                    {categories.filter(cat => cat.status === 'active').length}
                  </span>
                  <span className="font-thin text-gray-400 text-[10px]">
                    Đang kinh doanh
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-2 w-full md:w-1/4 border-y md:border-x md:border-y-0">
              <span className="font-semibold text-red-600 text-xs">
                Sắp hết hàng
              </span>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-xs">
                    {categories.filter(cat => cat.stock < 20 && cat.stock > 0).length}
                  </span>
                  <span className="font-thin text-gray-400 text-[10px]">
                    Sắp hết
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-xs">
                    {categories.filter(cat => cat.stock === 0).length}
                  </span>
                  <span className="font-thin text-gray-400 text-[10px]">
                    Hết hàng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg w-10/12 md:w-1/2 lg:w-1/3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Thêm danh mục mới</h2>
                <button
                  onClick={addCategoryModalSetting}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên danh mục</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nhà cung cấp</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={newCategory.manufacturer}
                    onChange={(e) => setNewCategory({ ...newCategory, manufacturer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={newCategory.status}
                    onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                  >
                    <option value="active">Đang kinh doanh</option>
                    <option value="inactive">Ngừng kinh doanh</option>
                  </select>
                </div>
                <button
                  onClick={addCategory}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Lưu danh mục
                </button>
              </div>
            </div>
          </div>
        )}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg w-10/12 md:w-1/2 lg:w-1/3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cập nhật danh mục</h2>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên danh mục</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={updateCategory.name || ''}
                    onChange={(e) => setUpdateCategory({ ...updateCategory, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nhà cung cấp</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={updateCategory.manufacturer || ''}
                    onChange={(e) => setUpdateCategory({ ...updateCategory, manufacturer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tồn kho</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={updateCategory.stock || 0}
                    onChange={(e) => setUpdateCategory({ ...updateCategory, stock: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={updateCategory.description || ''}
                    onChange={(e) => setUpdateCategory({ ...updateCategory, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    value={updateCategory.status || 'active'}
                    onChange={(e) => setUpdateCategory({ ...updateCategory, status: e.target.value })}
                  >
                    <option value="active">Đang kinh doanh</option>
                    <option value="inactive">Ngừng kinh doanh</option>
                  </select>
                </div>
                <button
                  onClick={saveUpdatedCategory}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Danh mục sản phẩm</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addCategoryModalSetting}
              >
                Thêm danh mục mới
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Tên danh mục
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Nhà cung cấp
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Tồn kho
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Mô tả
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Trạng thái
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentCategories.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.manufacturer}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {(element.stock || 0).toLocaleString('vi-VN')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.description}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.status === 'active' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Đang kinh doanh</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Ngừng kinh doanh</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => updateCategoryModalSetting(element)}
                      >
                        Sửa
                      </span>
                      <span
                        className="text-red-700 cursor-pointer ml-2"
                        onClick={() => deleteCategory(element._id)}
                      >
                        Xóa
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Category;
