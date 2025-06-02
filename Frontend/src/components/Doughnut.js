import React from 'react';
import { Doughnut as ChartJSDoughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';

/**
 * Component biểu đồ tròn hiển thị phân bố tồn kho theo danh mục
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Dữ liệu cho biểu đồ tròn
 * @param {Object} [props.options] - Tùy chọn cho biểu đồ
 * @param {string} [props.className=""] - Classes CSS bổ sung
 * @returns {JSX.Element}
 */
function DoughnutChart({ data, options = {}, className = "" }) {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                    padding: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return ` ${context.label}: ${context.parsed}%`;
                    }
                }
            }
        }
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return (
        <div className={`bg-white rounded-lg p-4 ${className}`}>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Phân bố tồn kho theo danh mục</h3>
            <div style={{ height: '350px' }}>
                <ChartJSDoughnut data={data} options={mergedOptions} />
            </div>
        </div>
    );
}

DoughnutChart.propTypes = {
    data: PropTypes.object.isRequired,
    options: PropTypes.object,
    className: PropTypes.string
};

export default DoughnutChart;