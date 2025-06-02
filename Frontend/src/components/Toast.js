import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

// Hàm hiển thị toast thành công
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Hàm hiển thị toast lỗi
export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Hàm hiển thị toast thông tin
export const showInfoToast = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Hàm hiển thị toast cảnh báo
export const showWarningToast = (message) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Hàm hiển thị toast xác nhận với các nút hành động
export const showConfirmToast = (message, confirmCallback, cancelCallback) => {
  // Tạo ID duy nhất cho toast này để có thể đóng nó sau khi xử lý
  const toastId = toast.info(
    <div>
      <div className="mb-2">{message}</div>
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => {
            toast.dismiss(toastId);
            if (cancelCallback) cancelCallback();
          }}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Hủy
        </button>
        <button
          onClick={() => {
            toast.dismiss(toastId);
            confirmCallback();
          }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Xóa
        </button>
      </div>
    </div>,
    {
      position: "top-center",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      closeButton: true,
    }
  );
  
  return toastId;
};

// Component ToastContainer cần được thêm vào App.js
export const ToastContainerComponent = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="z-50"
    />
  );
};

export default ToastContainerComponent;
