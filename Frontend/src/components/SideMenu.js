import React from "react";
import { Link } from "react-router-dom";

function SideMenu() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="h-full flex-col justify-between bg-white hidden lg:flex">
      <div className="px-4 py-6">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
          {/* Báo cáo & thống kê */}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg hover:bg-gray-100 px-4 py-2 text-gray-700"
          >
            <img
              alt="dashboard-icon"
              src={require("../assets/dashboard-icon.png")}
            />
            <span className="text-sm font-medium">Báo cáo & thống kê</span>
          </Link>

          {/* Quản lý danh mục hàng hóa */}
          <Link
            to="/category"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <img
              alt="category-icon"
              src={require("../assets/inventory-icon.png")}
            />
            <span className="text-sm font-medium">Quản lý danh mục hàng hóa</span>
          </Link>

          {/* Quản lý nhập xuất hàng hóa - with nested menu */}
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <div className="flex items-center gap-2">
                <img
                  alt="import-export-icon"
                  src={require("../assets/supplier-icon.png")}
                />
                <span className="text-sm font-medium">Quản lý nhập xuất hàng hóa</span>
              </div>

              <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </summary>

            <nav className="mt-1.5 ml-8 flex flex-col">
              <Link
                to="/import"
                className="flex items-center gap-1 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="text-sm font-medium">Nhập kho</span>
              </Link>

              <Link
                to="/export"
                className="flex items-center gap-1 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="text-sm font-medium">Xuất kho</span>
              </Link>
            </nav>
          </details>
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
            {localStorageData && localStorageData.name ? localStorageData.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <p className="text-xs">
              <strong className="block font-medium">
                {localStorageData ? localStorageData.name || 'Người dùng' : 'Người dùng'}
              </strong>

              <span> {localStorageData ? localStorageData.email || '' : ''} </span>
            </p>
          </div>
        </div>
        
        <Link to="/logout" className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border-t border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-medium">Đăng xuất</span>
        </Link>
      </div>
    </div>
  );
}

export default SideMenu;
