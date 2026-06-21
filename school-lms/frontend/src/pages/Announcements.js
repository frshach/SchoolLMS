// frontend/src/pages/Announcements.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Card, Form, Button, Modal, Badge } from 'react-bootstrap';
import api from '../api/api';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ courseId: '', title: '', message: '' });
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', {
        courseId: parseInt(newAnnouncement.courseId),
        title: newAnnouncement.title,
        message: newAnnouncement.message
      });
      setNewAnnouncement({ courseId: '', title: '', message: '' });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error adding announcement:', error);
      alert('Failed to add announcement. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/announcements/${editing.announcementId}`, {
        courseId: parseInt(editing.courseId),
        title: editing.title,
        message: editing.message
      });
      setShowModal(false);
      setEditing(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('Failed to update announcement. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Adakah anda pasti mahu memadam pengumuman ini?')) {
      try {
        await api.delete(`/announcements/${id}`);
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Failed to delete announcement. Please try again.');
      }
    }
  };

  const openEditModal = (announcement) => {
    setEditing({ ...announcement });
    setShowModal(true);
  };

  const isTeacher = user?.role === 'Teacher';

  return (
    <Layout>
      {isTeacher && (
        <Card className="custom-card mb-4 p-2">
          <Card.Header className="bg-white fw-bold text-dark border-0 pt-3 fs-5">Broadcast Announcement</Card.Header>
          <Card.Body>
            <Form onSubmit={handleAdd}>
              <div className="row g-3">
                <div className="col-md-3">
                  <Form.Control
                    type="number"
                    placeholder="Course ID"
                    value={newAnnouncement.courseId}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, courseId: e.target.value })}
                    className="rounded-3"
                    required
                  />
                </div>
                <div className="col-md-9">
                  <Form.Control
                    type="text"
                    placeholder="Announcement Title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="rounded-3"
                    required
                  />
                </div>
                <div className="col-12">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Type message details..."
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                    className="rounded-3"
                    required
                  />
                </div>
              </div>
              <Button type="submit" variant="warning" className="px-4 fw-semibold mt-3 text-dark">
                Post Notice
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <h3 className="fw-bold text-dark mb-3">Notice Board</h3>

      {loading ? (
        <Card className="custom-card p-4 text-center text-muted">Loading...</Card>
      ) : announcements.length === 0 ? (
        <Card className="custom-card p-4 text-center text-muted">No announcements available at the moment.</Card>
      ) : (
        announcements.map((announcement) => (
          <Card key={announcement.announcementId} className="mb-3 custom-card announcement-box border-0 shadow-sm">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold text-dark mb-1">{announcement.title}</h5>
                  <p className="text-secondary mb-0 small">{announcement.message}</p>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                  <Badge bg="warning-subtle" text="warning" className="border border-warning-subtle">
                    Course: #{announcement.courseId}
                  </Badge>
                  {isTeacher && (
                    <div className="btn-group btn-group-sm mt-1">
                      <Button
                        variant="outline-primary"
                        onClick={() => openEditModal(announcement)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(announcement.announcementId)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pt-4 px-4">
          <Modal.Title className="fw-bold">Edit Announcement</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body className="px-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-secondary">Course ID</Form.Label>
              <Form.Control
                type="number"
                value={editing?.courseId || ''}
                onChange={(e) => setEditing({ ...editing, courseId: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-secondary">Announcement Title</Form.Label>
              <Form.Control
                type="text"
                value={editing?.title || ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="small fw-semibold text-secondary">Message Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editing?.message || ''}
                onChange={(e) => setEditing({ ...editing, message: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pb-4 px-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Announcements;