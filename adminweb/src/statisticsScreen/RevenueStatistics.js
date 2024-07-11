import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  datasets: [
    {
      label: 'Doanh thu',
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
      hoverBorderColor: 'rgba(54, 162, 235, 1)',
      data: [65, 59, 80, 81, 56, 55, 40, 70, 75, 90, 85, 100] // Example data for 12 months
    }
  ]
};

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
          return `${context.dataset.label}: $${context.raw} nghìn`;
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
        text: 'Doanh thu (nghìn $)',
        font: {
          size: 14
        }
      },
      ticks: {
        callback: function(value) {
          return `$${value} nghìn`;
        }
      }
    }
  }
};

const RevenueStatistics = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white text-center">Thống kê doanh thu</Card.Header>
            <Card.Body>
              <Bar data={data} options={options} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RevenueStatistics;
