// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    role: 'Student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/login?success=1');
      } else {
        setError('Registration failed. Please check your details.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <Card className="auth-card">
            <Card.Header className="text-white text-center">
              <h3 className="fw-bold mb-1">Create Account</h3>
              <p className="text-white-50 small mb-0">Join your virtual campus today</p>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="border-0 bg-danger-subtle text-danger small rounded-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullname"
                    placeholder="John Doe"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="name@school.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary">Account Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="rounded-3"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </Form.Select>
                </Form.Group>
                <Button type="submit" className="btn-primary w-100 mb-3" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Account'}
                </Button>
              </Form>

              <div className="text-center">
                <p className="small text-muted mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#4338ca' }}>
                    Login Here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Register;