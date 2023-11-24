import React from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from 'chart.js/auto'

export default function BarChart(props) {
    return (
        <div>
            <Bar
                data={props.chartData}
                options={{
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Help Desk Agents'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Total Tickets'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: "Each Agent's Total Number of Tickets"
                        },
                        legend: {
                            display: false,
                            position: "bottom"
                        },
                    }
                }}
            />
        </div>
    );
};