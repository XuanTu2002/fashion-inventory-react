import React, { useState } from 'react';
import { FiFilter } from 'react-icons/fi'; // Sử dụng icon từ react-icons

const Filter = ({ onApplyFilter }) => {
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all', // 'all', 'active', 'inactive'
        manufacturer: '',
        hasStock: 'all' // 'all', 'has', 'empty'
    });

    const toggleFilterMenu = () => {
        setShowFilterMenu(!showFilterMenu);
    };

    const handleFilterChange = (field, value) => {
        setFilters({
            ...filters,
            [field]: value
        });
    };

    const applyFilter = () => {
        onApplyFilter(filters);
        setShowFilterMenu(false);
    };

    const resetFilter = () => {
        const resetFilters = {
            status: 'all',
            manufacturer: '',
            hasStock: 'all'
        };
        setFilters(resetFilters);
        onApplyFilter(resetFilters);
        setShowFilterMenu(false);
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={toggleFilterMenu}
                className="bg-white p-2 rounded-md border border-gray-300 flex items-center"
            >
                <FiFilter className="w-5 h-5 text-gray-500" />
            </button>

            {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white z-10 p-3 border border-gray-200">
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang kinh doanh</option>
                            <option value="inactive">Ngừng kinh doanh</option>
                        </select>
                    </div>

                    {/* Thêm các tùy chọn lọc khác ở đây */}

                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            onClick={resetFilter}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Đặt lại
                        </button>
                        <button
                            onClick={applyFilter}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filter;