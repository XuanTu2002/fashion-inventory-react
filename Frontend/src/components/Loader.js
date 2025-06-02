import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      <span className="sr-only">Đang tải...</span>
    </div>
  );
};

export default Loader;
