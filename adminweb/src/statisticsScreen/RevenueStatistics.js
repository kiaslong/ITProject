import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          size: 14
        }
      }
    },
    title: {
      display: true,
      text: 'Doanh thu hàng tháng',
      font: {
        size: 18
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.raw.toLocaleString('vi-VN')} VND`;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Tháng',
        font: {
          size: 14
        }
      }
    },
    y: {
      title: {
        display: true,
        text: 'Doanh thu (VND)',
        font: {
          size: 14
        }
      },
      ticks: {
        callback: function(value) {
          return `${(value / 1000000).toLocaleString('vi-VN')} triệu `;
        }
      },
      suggestedMin: 0,
      suggestedMax: 20000000, // Adjust this value based on the expected range of your data
    }
  }
};

const RevenueStatistics = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Doanh thu',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        data: []
      }
    ]
  });

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await api.get('order/completed-payments', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const orders = response.data;
        console.log('Fetched orders:', orders); // Log fetched orders

        const monthlyRevenue = new Array(12).fill(0);
        orders.forEach(order => {
          const updatedAt = new Date(order.updatedAt);
          const month = updatedAt.getMonth(); // Get month from 0 (Jan) to 11 (Dec)
          const totalPrice = parseFloat(order.totalPrice)  || 0; // Ensure totalPrice is a number
          console.log(`Order ID: ${order.id}, Month: ${month}, Total Price: ${totalPrice}`); // Log each order's details
          monthlyRevenue[month] += totalPrice * 0.3;
        });
        console.log('Monthly Revenue:', monthlyRevenue); // Log calculated monthly revenue

        setData({
          labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
          datasets: [
            {
              label: 'Doanh thu',
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
              data: monthlyRevenue
            }
          ]
        });
      } catch (error) {
        console.error('Không thể lấy dữ liệu đơn hàng đã hoàn thành', error);
      }
    };

    fetchCompletedOrders();
  }, []);

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white text-center">Thống kê doanh thu</Card.Header>
            <Card.Body>
              <Line data={data} options={options} />
              <div className="mt-3 text-center">
                <p>Biểu đồ này hiển thị doanh thu hàng tháng tính bằng triệu VND. Mỗi điểm đại diện cho tổng doanh thu của tháng đó.</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RevenueStatistics;
