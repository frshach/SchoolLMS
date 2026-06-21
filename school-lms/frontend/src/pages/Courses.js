// frontend/src/pages/Courses.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Card, Table, Form, Button } from 'react-bootstrap';
import api from '../api/api';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ courseName: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', {
        ...newCourse,
        teacherId: user?.userId
      });
      setNewCourse({ courseName: '', description: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const isTeacher = user?.role === 'Teacher';

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Course Management</h2>
      </div>

      {isTeacher && (
        <Card className="custom-card mb-4 p-2">
          <Card.Header className="bg-white fw-bold text-dark border-0 pt-3 fs-5">Create New Course</Card.Header>
          <Card.Body>
            <Form onSubmit={handleAddCourse}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary">Course Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Object Oriented Systems Design"
                  value={newCourse.courseName}
                  onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Enter course description criteria..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="px-4 fw-semibold">
                Add Course
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Card className="custom-card">
        <Card.Header className="bg-white fw-bold text-dark border-0 pt-3 fs-5">Available Course Catalog</Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="table-custom mb-0 table-hover">
              <thead>
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Course Name</th>
                  <th className="pe-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">Loading...</td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">No courses available.</td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.courseId}>
                      <td className="ps-4 fw-semibold text-secondary">#{course.courseId}</td>
                      <td className="fw-bold text-dark">{course.courseName}</td>
                      <td className="pe-4 text-muted small">{course.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default Courses;