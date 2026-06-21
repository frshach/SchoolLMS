// frontend/src/pages/ViewSubmissions.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Table, Form, Button, Alert } from 'react-bootstrap';
import api from '../api/api';

const ViewSubmissions = () => {
  const { user } = useAuth();
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({});
  const [feedback, setFeedback] = useState({});
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('msg') === 'saved') {
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 5000);
    }
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/submissions/assignment/${assignmentId}`);
      setSubmissions(response.data);
      
      // Initialize grading state
      const gradings = {};
      const feedbacks = {};
      response.data.forEach((sub) => {
        gradings[sub.submissionId] = sub.grade || '';
        feedbacks[sub.submissionId] = sub.feedback || '';
      });
      setGrading(gradings);
      setFeedback(feedbacks);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (submissionId, value) => {
    setGrading({ ...grading, [submissionId]: value });
  };

  const handleFeedbackChange = (submissionId, value) => {
    setFeedback({ ...feedback, [submissionId]: value });
  };

  const handleSaveGrade = async (submissionId) => {
    try {
      await api.post('/submissions/grade', {
        submissionId: submissionId,
        grade: grading[submissionId],
        feedback: feedback[submissionId]
      });
      // Refresh with success message
      navigate(`/submissions/${assignmentId}?msg=saved`);
      window.location.reload();
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Gagal mengemas kini gred.');
    }
  };

  const downloadFile = (submissionId, fileName) => {
    window.open(`${process.env.REACT_APP_API_URL}/submissions/download/${submissionId}`, '_blank');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('en-MY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-layout">
      <Container fluid className="py-4">
        {successMsg && (
          <Alert variant="success" className="border-0 shadow-sm rounded-3 alert-dismissible fade show mb-4" onClose={() => setSuccessMsg(false)} dismissible>
            ✨ <strong>Successfully saved!</strong> The assignment grade and feedback have been updated to the student's profile.
          </Alert>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">📂 Assignment Submissions</h3>
            <p className="text-muted small mb-0">Managing submissions for Assignment ID: #{assignmentId}</p>
          </div>
          <Button variant="outline-secondary" size="sm" className="px-3 rounded-pill fw-semibold" onClick={() => navigate('/assignments')}>
            ← Back to Ledger
          </Button>
        </div>

        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table className="table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3">Submission ID</th>
                    <th className="py-3">Student ID</th>
                    <th className="py-3">Submitted File Resource</th>
                    <th className="py-3">Submission Description</th>
                    <th className="py-3">Submit Date</th>
                    <th className="py-3" style={{ width: '150px' }}>Grade (100)</th>
                    <th className="py-3">Feedback Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">Loading...</td>
                    </tr>
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">No submissions found for this assignment active status.</td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr key={sub.submissionId}>
                        <td className="fw-semibold text-secondary">#{sub.submissionId}</td>
                        <td>
                          <Badge bg="secondary">Student #{sub.studentId}</Badge>
                        </td>
                        <td>
                          <button
                            className="btn btn-link file-link p-0"
                            onClick={() => downloadFile(sub.submissionId, sub.fileName)}
                          >
                            📄 {sub.fileName}
                          </button>
                        </td>
                        <td className="small text-dark-emphasis fw-medium">
                          {!sub.submissionNotes || sub.submissionNotes.trim() === '' ? (
                            <span className="text-muted fst-italic small">No description.</span>
                          ) : (
                            sub.submissionNotes
                          )}
                        </td>
                        <td className="small text-muted">{formatDate(sub.submitDate)}</td>
                        <td colSpan="2">
                          <Form className="m-0">
                            <div className="row g-2">
                              <div className="col-md-4">
                                <Form.Control
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  value={grading[sub.submissionId] || ''}
                                  onChange={(e) => handleGradeChange(sub.submissionId, e.target.value)}
                                  className="form-control-sm rounded-3"
                                  required
                                />
                              </div>
                              <div className="col-md-8">
                                <div className="d-flex gap-2">
                                  <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Add custom feedback..."
                                    value={feedback[sub.submissionId] || ''}
                                    onChange={(e) => handleFeedbackChange(sub.submissionId, e.target.value)}
                                    className="form-control-sm rounded-3"
                                  />
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="px-3 rounded-3 fw-semibold"
                                    onClick={() => handleSaveGrade(sub.submissionId)}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ViewSubmissions;