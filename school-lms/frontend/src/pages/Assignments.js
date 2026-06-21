// frontend/src/pages/Assignments.js (COMPLETE)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, Table, Form, Button, Badge } from 'react-bootstrap';
import api from '../api/api';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [pendingCounts, setPendingCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState({});
  const [file, setFile] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');

  const isTeacher = user?.role === 'Teacher';
  const isStudent = user?.role === 'Student';

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);

      // Fetch submission status for students
      if (isStudent) {
        const statusMap = {};
        for (const assignment of response.data) {
          try {
            const statusRes = await api.get(`/assignments/${assignment.assignmentId}/submission-status`, {
              params: { studentId: user.userId }
            });
            statusMap[assignment.assignmentId] = statusRes.data.submitted;
          } catch (error) {
            console.error('Error fetching submission status:', error);
          }
        }
        setSubmissionStatus(statusMap);
      }

      // Fetch pending counts for teachers
      if (isTeacher) {
        const countMap = {};
        for (const assignment of response.data) {
          try {
            const countRes = await api.get(`/assignments/${assignment.assignmentId}/pending-count`);
            countMap[assignment.assignmentId] = countRes.data.pendingCount;
          } catch (error) {
            console.error('Error fetching pending count:', error);
          }
        }
        setPendingCounts(countMap);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assignments', {
        courseId: parseInt(newAssignment.courseId),
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate
      });
      setNewAssignment({ courseId: '', title: '', description: '', dueDate: '' });
      fetchAssignments();
    } catch (error) {
      console.error('Error adding assignment:', error);
      alert('Failed to add assignment. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitAssignment = async (assignmentId) => {
    if (!file) {
      alert('Please select a file to submit.');
      return;
    }

    setSubmitLoading({ ...submitLoading, [assignmentId]: true });

    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('studentId', user.userId);
    formData.append('submissionNotes', submissionNotes);
    formData.append('file', file);

    try {
      await api.post('/submissions/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      setSubmissionNotes('');
      fetchAssignments();
      alert('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitLoading({ ...submitLoading, [assignmentId]: false });
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-MY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      {isTeacher && (
        <Card className="custom-card mb-4 p-2">
          <Card.Header className="bg-white fw-bold text-dark border-0 pt-3 fs-5">Publish New Assignment</Card.Header>
          <Card.Body>
            <Form onSubmit={handleAddAssignment}>
              <div className="row g-3">
                <div className="col-md-2">
                  <Form.Label className="small fw-semibold text-secondary">Course ID</Form.Label>
                  <Form.Control
                    type="number"
                    value={newAssignment.courseId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <Form.Label className="small fw-semibold text-secondary">Assignment Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <Form.Label className="small fw-semibold text-secondary">Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <Form.Label className="small fw-semibold text-secondary">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" className="mt-3 px-4">
                Post Assignment
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <h3 className="fw-bold text-dark mb-3">Assignment Ledger</h3>
      <Card className="custom-card p-3">
        <div className="table-responsive">
          <Table className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Assignment ID</th>
                <th>Course ID</th>
                <th>Title</th>
                <th>Due Date</th>
                <th>Description</th>
                <th style={{ width: '340px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">Loading...</td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">No assignments available.</td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.assignmentId}>
                    <td className="fw-semibold text-secondary">#{assignment.assignmentId}</td>
                    <td>#{assignment.courseId}</td>
                    <td className="fw-bold text-dark">{assignment.title}</td>
                    <td>
                      <Badge bg="danger-subtle" text="danger">
                        {formatDate(assignment.dueDate)}
                      </Badge>
                    </td>
                    <td className="small text-muted">{assignment.description}</td>
                    <td>
                      {isStudent ? (
                        submissionStatus[assignment.assignmentId] ? (
                          <Badge bg="success" className="px-3 py-1.5 fs-7 rounded-2">Submitted</Badge>
                        ) : (
                          <div className="p-2 border rounded-3 bg-light-subtle">
                            <Form className="m-0">
                              <Form.Group className="mb-1.5">
                                <Form.Label className="text-secondary fw-bold small mb-1">Choose Submission File:</Form.Label>
                                <Form.Control
                                  type="file"
                                  size="sm"
                                  onChange={handleFileChange}
                                  required
                                />
                              </Form.Group>
                              <Form.Group className="mb-2">
                                <Form.Label className="text-secondary fw-bold small mb-1">Submission Description:</Form.Label>
                                <Form.Control
                                  type="text"
                                  size="sm"
                                  placeholder="e.g., Final draft upload"
                                  value={submissionNotes}
                                  onChange={(e) => setSubmissionNotes(e.target.value)}
                                  required
                                />
                              </Form.Group>
                              <Button
                                variant="success"
                                size="sm"
                                className="w-100 fw-semibold shadow-sm"
                                onClick={() => handleSubmitAssignment(assignment.assignmentId)}
                                disabled={submitLoading[assignment.assignmentId]}
                              >
                                {submitLoading[assignment.assignmentId] ? 'Submitting...' : 'Submit Assignment'}
                              </Button>
                            </Form>
                          </div>
                        )
                      ) : (
                        <div className="d-inline-flex align-items-center">
                          <Link
                            to={`/submissions/${assignment.assignmentId}`}
                            className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold"
                          >
                            View Submissions
                          </Link>
                          {pendingCounts[assignment.assignmentId] > 0 && (
                            <span
                              className="notification-badge shadow-sm"
                              title={`${pendingCounts[assignment.assignmentId]} Not Yet Reviewed`}
                            >
                              {pendingCounts[assignment.assignmentId]}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </Layout>
  );
};

export default Assignments;