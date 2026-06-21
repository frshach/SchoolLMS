// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const role = params.get('role') || 'User';
  const successParam = params.get('success');

  useEffect(() => {
    if (successParam === '1') {
      setSuccess(true);
    }
  }, [successParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password, role);
    if (result.success) {
      navigate('/dashboard');
    } else {
      if (result.error === 'unauthorized') {
        setError('Access Denied: You are not authorized for this portal.');
      } else if (result.error === 'invalid') {
        setError('Invalid email or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <Card className="auth-card">
            <Card.Header className="text-white text-center">
              <h3 className="fw-bold mb-1">Welcome Back</h3>
              <p className="text-white-50 small mb-0">Sign in to the <strong>{role}</strong> Portal</p>
            </Card.Header>
            <Card.Body className="p-4">
              {success && (
                <Alert variant="success" className="border-0 bg-success-subtle text-success small rounded-3">
                  Registration successful! Please login using your credentials.
                </Alert>
              )}
              {error && (
                <Alert variant="danger" className="border-0 bg-danger-subtle text-danger small rounded-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-secondary">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="btn-primary w-100 mb-3">
                  Sign In
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p className="small text-muted mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: '#4f46e5' }}>
                    Register Here
                  </Link>
                </p>
                <Link to="/" className="d-block small text-secondary mt-3 text-decoration-none">
                  ← Back to Portal Selection
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Login;