import React from 'react';
import PropTypes from 'prop-types';

/**
 * DashboardCard - Component hiển thị thông tin dạng card trên Dashboard
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Tiêu đề của card
 * @param {number|string} props.value - Giá trị chính hiển thị trong card
 * @param {string} [props.unit] - Đơn vị của giá trị (ví dụ: ₫, danh mục)
 * @param {string} [props.trend] - Xu hướng ("up" hoặc "down")
 * @param {string} [props.trendValue] - Giá trị % của xu hướng
 * @param {string} [props.trendColor] - Màu sắc của xu hướng ("green" hoặc "red")
 * @param {string} [props.className] - Class CSS bổ sung cho component
 * @returns {JSX.Element}
 */
function DashboardCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  trendColor = "green",
  className = "",
  formatValue = true
}) {
  // Format giá trị tiền tệ nếu cần
  const formattedValue = formatValue && typeof value === 'number' 
    ? value.toLocaleString('vi-VN') 
    : value;
  
  // Xác định icon và class màu cho trend
  const trendColorClass = trendColor === "green" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";
  
  return (
    <article className={`flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 ${className}`}>
      {trend && trendValue && (
        <div className={`inline-flex gap-2 self-end rounded p-1 ${trendColorClass}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {trend === "up" ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            )}
          </svg>
          <span className="text-xs font-medium">{trendValue}</span>
        </div>
      )}

      <div>
        <strong className="block text-sm font-medium text-gray-500">
          {title}
        </strong>

        <p>
          <span className="text-2xl font-medium text-gray-900">
            {formattedValue}{unit === '₫' && <span> {unit}</span>}
          </span>
          
          {/* Unit hiển thị riêng nếu không phải đơn vị tiền tệ */}
          {unit && unit !== '₫' && (
            <span className="text-xs text-gray-500"> {unit} </span>
          )}
        </p>
      </div>
    </article>
  );
}

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  unit: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down', undefined]),
  trendValue: PropTypes.string,
  trendColor: PropTypes.oneOf(['green', 'red']),
  className: PropTypes.string,
  formatValue: PropTypes.bool
};

export default DashboardCard;