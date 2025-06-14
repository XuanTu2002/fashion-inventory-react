import React, { useState, useContext, useEffect } from "react";
import AddExport from "../components/AddExport";
import UpdateExport from "../components/UpdateExport";
import AuthContext from "../context/AuthContext";
import Pagination from "../components/Pagination";
import { showSuccessToast, showErrorToast, showConfirmToast } from "../components/Toast";

function Export() {
  const [showExportModal, setExportModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedExport, setSelectedExport] = useState({});
  const [exports, setAllExportsData] = useState([]);
  const [categories, setAllCategories] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      fetchSearchData();
    } else {
      fetchExportsData();
    }
    fetchCategoriesData();
  }, [updatePage, searchTerm]);

  // Fetching Data of All Exports
  const fetchExportsData = () => {
    fetch(`http://localhost:4000/api/export`)
      .then((response) => response.json())
      .then((data) => {
        setAllExportsData(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of Search Export items
  const fetchSearchData = () => {
    fetch(`http://localhost:4000/api/export?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setAllExportsData(data);
      })
      .catch((err) => console.log(err));
  };
  
  // Xử lý thay đổi tìm kiếm với debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Xóa timeout hiện tại nếu có
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Đặt timeout mới để tránh gửi quá nhiều request
    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Fetching Data of All Categories
  const fetchCategoriesData = () => {
    fetch(`http://localhost:4000/api/category`)
      .then((response) => response.json())
      .then((data) => {
        setAllCategories(data);
      })
      .catch((err) => console.log(err));
  };

  // No client data needed as per requirements

  // Modal for Export Add
  const addExportModalSetting = () => {
    setExportModal(!showExportModal);
  };

  // Modal for Export Update
  const updateExportModalSetting = (exportData) => {
    setSelectedExport(exportData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Delete Export
  const deleteExport = (id) => {
    showConfirmToast(
      'Bạn có chắc muốn xóa phiếu xuất này không?',
      () => {
        fetch(`http://localhost:4000/api/export/${id}`, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(data => {
            showSuccessToast('Đã xóa phiếu xuất thành công');
            setUpdatePage(!updatePage);
          })
          .catch(err => {
            showErrorToast('Lỗi khi xóa phiếu xuất: ' + (err.message || 'Không thể kết nối với máy chủ'));
            console.log(err);
          });
      }
    );
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Tính toán dữ liệu phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExports = exports.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(exports.length / itemsPerPage);

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showExportModal && (
          <AddExport
            addExportModalSetting={addExportModalSetting}
            products={categories}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {showUpdateModal && (
          <UpdateExport
            updateExportModalSetting={updateExportModalSetting}
            exportData={selectedExport}
            products={categories}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Thông tin xuất hàng</span>
            </div>
            <div className="flex gap-4 items-center">
              {/* Hộp tìm kiếm */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên danh mục..."
                  className="border border-gray-300 rounded-lg py-1 px-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addExportModalSetting}
              >
                Thêm phiếu xuất hàng
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
                  Số lượng xuất
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Giá xuất/đơn vị
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Ngày xuất
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Tổng giá trị xuất
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentExports.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.category?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.unitPrice?.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {new Date(element.exportDate).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                        ? "Hôm nay"
                        : new Date(element.exportDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.totalPrice?.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => updateExportModalSetting(element)}
                      >
                        Sửa
                      </span>
                      <span
                        className="text-red-700 cursor-pointer ml-2"
                        onClick={() => deleteExport(element._id)}
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

export default Export;
