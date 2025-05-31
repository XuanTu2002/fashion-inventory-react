import React, { useState } from "react";

function UploadImage({ uploadImage }) {
  const [fileName, setFileName] = useState("");

  const handleFileInputChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0]);
      uploadImage(event.target.files[0]);
    }
  };

  return (
    <div className="mt-1">
      <label
        htmlFor="fileInput"
        className="inline-flex items-center rounded-md shadow-sm py-2 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>
          {fileName?.name ? fileName.name : "Chọn hình ảnh"}
        </span>
      </label>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".png, .jpeg, .jpg"
        required
        onChange={handleFileInputChange}
      />
      <p className="mt-1 text-sm text-gray-500">
        PNG, JPG, JPEG (tối đa 5MB)
      </p>
    </div>
  );
}

export default UploadImage;
