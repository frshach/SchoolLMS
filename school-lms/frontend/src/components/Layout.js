// frontend/src/components/Layout.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard Home' },
    { path: '/courses', icon: '📚', label: 'Courses Matrix' },
    { path: '/assignments', icon: '📝', label: 'Assignments Ledger' },
    { path: '/announcements', icon: '📢', label: 'Announcements Board' },
  ];

  if (user?.role === 'Student') {
    menuItems.push({ path: '/grades', icon: '🏆', label: 'My Grades & Feedback' });
  }

  return (
    <div className="dashboard-layout">
      <Navbar bg="primary" variant="dark" fixed="top" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/dashboard" className="fw-bold">
            🏫 SchoolLMS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
            <div className="d-flex align-items-center gap-3">
              <div className="profile-badge text-white">
                <span>👤</span>
                <span><strong>{user?.fullname}</strong></span>
                <Badge bg="light" text="primary" className="text-uppercase">
                  {user?.role}
                </Badge>
              </div>
              <button onClick={logout} className="btn btn-danger btn-sm px-3 rounded-pill fw-semibold">
                Logout
              </button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="dashboard-container">
        <aside className="lms-sidebar">
          <div className="sidebar-heading">Academic Modules</div>
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={`sidebar-link ${isActive(item.path)}`}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .dashboard-layout {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #f8fafc;
        }
        .dashboard-container {
          display: flex;
          min-height: calc(100vh - 56px);
          padding-top: 56px;
        }
        .lms-sidebar {
          width: 260px;
          background-color: #ffffff;
          border-right: 1px solid #e2e8f0;
          padding: 1.5rem 1rem;
          flex-shrink: 0;
          height: calc(100vh - 56px);
          position: sticky;
          top: 56px;
          overflow-y: auto;
        }
        .sidebar-heading {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          font-weight: 700;
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }
        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .sidebar-link {
          color: #475569;
          text-decoration: none;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s ease;
        }
        .sidebar-link:hover {
          color: #0d6efd;
          background-color: #f1f5f9;
        }
        .sidebar-link.active {
          color: #ffffff;
          background-color: #0d6efd;
          font-weight: 600;
        }
        .main-content {
          flex-grow: 1;
          padding: 2.5rem;
          background-color: #f8fafc;
          overflow-y: auto;
        }
        .profile-badge {
          background-color: rgba(255, 255, 255, 0.15);
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }
          .lms-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem;
            height: auto;
            position: relative;
            top: 0;
          }
          .main-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;