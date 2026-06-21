// frontend/src/pages/Index.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const Index = () => {
  return (
    <div className="index-page">
      <Container>
        <Row className="justify-content-center min-vh-100 align-items-center">
          <Col lg={9} md={11}>
            <div className="hero-section bg-white p-5 rounded-4 shadow-sm border">
              <div className="text-center mb-4">
                <Badge bg="primary" className="px-3 py-2 rounded-pill fw-bold text-uppercase">
                  Next-Gen Learning
                </Badge>
              </div>
              <h1 className="display-5 fw-bold text-center" style={{ color: '#0f172a' }}>
                Welcome to SchoolLMS
              </h1>
              <p className="text-muted lead text-center mb-5" style={{ maxWidth: '580px', margin: '0 auto' }}>
                Your unified digital campus dashboard. Please select your dedicated portal below to access courses, deployments, and announcements.
              </p>

              <Row className="g-4 justify-content-center">
                <Col sm={6} md={5}>
                  <Link to="/login?role=Teacher" className="text-decoration-none">
                    <Card className="h-100 p-4 portal-card teacher-card text-center">
                      <Card.Body>
                        <div className="icon-circle text-success mx-auto mb-3" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                          👨‍🏫
                        </div>
                        <h4 className="fw-bold text-dark mb-2">Teacher Portal</h4>
                        <p className="text-muted small mb-0">
                          Manage course classrooms, launch custom assignments, and broadcast news feed notices.
                        </p>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col sm={6} md={5}>
                  <Link to="/login?role=Student" className="text-decoration-none">
                    <Card className="h-100 p-4 portal-card student-card text-center">
                      <Card.Body>
                        <div className="icon-circle text-primary mx-auto mb-3" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                          🎓
                        </div>
                        <h4 className="fw-bold text-dark mb-2">Student Portal</h4>
                        <p className="text-muted small mb-0">
                          Track academic tracks, download syllabus resources, and upload completed task files.
                        </p>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Index;