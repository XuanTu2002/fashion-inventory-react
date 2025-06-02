import React from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

/**
 * Component biểu đồ cột hiển thị dữ liệu xuất nhập hàng theo tháng
 * 
 * @param {Object} props - Component props
 * @param {Object} props.options - Cấu hình tùy chọn cho biểu đồ
 * @param {Array} props.series - Dữ liệu chuỗi cho biểu đồ
 * @param {string} [props.width="100%"] - Chiều rộng của biểu đồ
 * @param {string} [props.height="350"] - Chiều cao của biểu đồ
 * @param {string} [props.className=""] - Classes CSS bổ sung
 * @returns {JSX.Element}
 */
function BarChart({ options, series, width = "100%", height = "350", className = "" }) {
    return (
        <div className={`bg-white rounded-lg p-4 ${className}`}>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Biểu đồ xuất nhập hàng theo tháng</h3>
            <Chart
                options={options}
                series={series}
                type="bar"
                width={width}
                height={height}
            />
        </div>
    );
}

BarChart.propTypes = {
    options: PropTypes.object.isRequired,
    series: PropTypes.array.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string
};

export default BarChart;