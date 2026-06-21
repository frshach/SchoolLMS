// frontend/src/pages/StudentGrades.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Card, Table, Badge } from 'react-bootstrap';
import api from '../api/api';

const StudentGrades = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/submissions/student/${user?.userId}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
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

  const downloadFile = (submissionId, fileName) => {
    window.open(`${process.env.REACT_APP_API_URL}/submissions/download/${submissionId}`, '_blank');
  };

  return (
    <Layout>
      <h3 className="fw-bold text-dark mb-3">Your Assignment Results & Marks</h3>
      <Card className="custom-card p-3">
        <div className="table-responsive">
          <Table className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Assignment ID</th>
                <th>Course ID</th>
                <th>Sent File Name</th>
                <th>Submission Date</th>
                <th>Grade</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">Loading...</td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    Anda belum menghantar sebarang tugasan lagi.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.submissionId}>
                    <td>
                      <Badge bg="primary-subtle" text="primary" className="fw-semibold">
                        Assignment #{sub.assignmentId}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="dark-subtle" text="dark" className="fw-semibold">
                        Course #1
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="btn btn-link text-decoration-none fw-semibold text-primary p-0"
                        onClick={() => downloadFile(sub.submissionId, sub.fileName)}
                      >
                        📄 {sub.fileName}
                      </button>
                    </td>
                    <td className="small text-muted">{formatDate(sub.submitDate)}</td>
                    <td>
                      {(!sub.grade || sub.grade === 0) && (!sub.feedback || sub.feedback.trim() === '') ? (
                        <Badge bg="warning-subtle" text="warning" className="px-3 py-1">
                          Awaiting Review
                        </Badge>
                      ) : (
                        <strong className="text-success">{sub.grade} / 100</strong>
                      )}
                    </td>
                    <td>
                      <p className="mb-0 small text-dark">
                        {!sub.feedback || sub.feedback.trim() === '' ? (
                          <em className="text-muted">Tiada komen disediakan.</em>
                        ) : (
                          sub.feedback
                        )}
                      </p>
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

export default StudentGrades;