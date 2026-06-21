// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import Layout from '../components/Layout';
import api from '../api/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ courseCount: 0, assignmentCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await api.get('/dashboard/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = user?.role === 'Teacher';
  const cardTitle1 = isTeacher ? 'Deployed Courses' : 'My Enrolled Courses';
  const cardTitle2 = isTeacher ? 'Active Assignments' : 'Pending Tasks';
  const cardSub1 = isTeacher ? 'Manage Course Matrix →' : 'Explore active classrooms →';
  const cardSub2 = isTeacher ? 'View Evaluation Registry →' : 'Complete submission entries →';

  return (
    <Layout>
      <div className="welcome-panel mb-4">
        <h2 className="fw-bold text-dark mb-1">Welcome back, {user?.fullname}!</h2>
        <p className="text-muted mb-0">Here's a personalized look at your academic dashboard profile metrics today.</p>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <Card className="metric-card bg-success text-white h-100">
            <Card.Body className="d-flex flex-column justify-content-between p-4">
              <div>
                <h6 className="text-uppercase fw-bold text-white-50 small mb-2">{cardTitle1}</h6>
                <h2 className="display-5 fw-bold mb-0">{loading ? '...' : metrics.courseCount}</h2>
              </div>
              <div className="mt-3 text-white-50 small">
                <Link to="/courses" className="text-white text-decoration-none fw-semibold">
                  {cardSub1}
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="metric-card bg-dark text-white h-100">
            <Card.Body className="d-flex flex-column justify-content-between p-4">
              <div>
                <h6 className="text-uppercase fw-bold text-white-50 small mb-2">{cardTitle2}</h6>
                <h2 className="display-5 fw-bold mb-0">{loading ? '...' : metrics.assignmentCount}</h2>
              </div>
              <div className="mt-3 text-white-50 small">
                <Link to="/assignments" className="text-white text-decoration-none fw-semibold">
                  {cardSub2}
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Dashboard;