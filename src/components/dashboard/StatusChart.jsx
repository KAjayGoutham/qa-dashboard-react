import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const StatusChart = ({ modules }) => {
    const passed = modules.filter(m => m.status === 'Passed').length;
    const failed = modules.filter(m => m.status === 'Failed').length;
    const inProgress = modules.filter(m => m.status === 'In Progress').length;
    const blocked = modules.filter(m => m.status === 'Blocked').length;

    const data = {
        labels: ['Passed', 'Failed', 'In Progress', 'Blocked'],
        datasets: [{
            data: [passed, failed, inProgress, blocked],
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#6b7280'],
            borderWidth: 0
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                    usePointStyle: true
                }
            }
        },
        cutout: '70%'
    };

    return (
        <div style={{ height: '175px' }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};
