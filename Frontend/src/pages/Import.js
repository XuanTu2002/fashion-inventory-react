import React, { useState, useEffect, useContext } from "react";
import AddImport from "../components/AddImport";
import AuthContext from "../AuthContext";

function Import() {
  const [showImportModal, setImportModal] = useState(false);
  const [imports, setAllImportsData] = useState([]);
  const [categories, setAllCategories] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchImportsData();
    fetchCategoriesData();
  }, [updatePage]);

  // Fetching Data of All Import items
  const fetchImportsData = () => {
    fetch(`http://localhost:4000/api/import/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllImportsData(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of All Categories
  const fetchCategoriesData = () => {
    fetch(`http://localhost:4000/api/category/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllCategories(data);
      })
      .catch((err) => console.log(err));
  };

  // Modal for Import Add
  const addImportModalSetting = () => {
    setImportModal(!showImportModal);
  };

  
  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showImportModal && (
          <AddImport
            addImportModalSetting={addImportModalSetting}
            products={categories}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Thông tin nhập hàng</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addImportModalSetting}
              >
                Thêm nhập hàng
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
                  Số lượng nhập
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Giá nhập/đơn vị
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Ngày nhập
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Tổng giá trị nhập
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {imports.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.category?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ₫{element.unitPrice?.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {new Date(element.importDate).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Hôm nay"
                        : new Date(element.importDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      ₫{element.totalPrice?.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Import;
