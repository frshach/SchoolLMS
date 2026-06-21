package com.schoollms.dao;

import com.schoollms.model.Submission;
import com.schoollms.util.DBConnection;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.model.Updates;
import org.bson.Document;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class SubmissionDAO {

    private MongoCollection<Document> getCollection() {
        return DBConnection.getDatabase().getCollection("submissions");
    }

    private Submission fromDoc(Document doc) {
        Submission s = new Submission();
        s.setSubmissionId(doc.getInteger("submission_id"));
        s.setAssignmentId(doc.getInteger("assignment_id"));
        s.setStudentId(doc.getInteger("student_id"));
        s.setFileName(doc.getString("file_name"));
        s.setFilePath(doc.getString("file_path"));
        java.util.Date d = doc.getDate("submit_date");
        if (d != null) s.setSubmitDate(new Timestamp(d.getTime()));
        Double grade = doc.getDouble("grade");
        s.setGrade(grade != null ? grade : 0.0);
        s.setFeedback(doc.getString("feedback"));
        s.setSubmissionNotes(doc.getString("submission_notes"));
        return s;
    }

    public boolean submitAssignment(Submission submission) {
        try {
            int newId = DBConnection.getNextSequence("submission_id");
            Document doc = new Document("submission_id", newId)
                    .append("assignment_id", submission.getAssignmentId())
                    .append("student_id", submission.getStudentId())
                    .append("file_name", submission.getFileName())
                    .append("file_path", submission.getFilePath())
                    .append("submission_notes", submission.getSubmissionNotes())
                    .append("submit_date", new java.util.Date())
                    .append("grade", 0.0)
                    .append("feedback", null);
            getCollection().insertOne(doc);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Submission> getSubmissionsByAssignment(int assignmentId) {
        List<Submission> list = new ArrayList<>();
        try {
            for (Document doc : getCollection()
                    .find(Filters.eq("assignment_id", assignmentId))
                    .sort(Sorts.descending("submit_date"))) {
                list.add(fromDoc(doc));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean hasSubmitted(int assignmentId, int studentId) {
        try {
            Document doc = getCollection().find(
                Filters.and(Filters.eq("assignment_id", assignmentId), Filters.eq("student_id", studentId))
            ).first();
            return doc != null;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean gradeSubmission(int submissionId, double grade, String feedback) {
        try {
            return getCollection().updateOne(
                Filters.eq("submission_id", submissionId),
                Updates.combine(Updates.set("grade", grade), Updates.set("feedback", feedback))
            ).getModifiedCount() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Submission getSubmissionById(int submissionId) {
        try {
            Document doc = getCollection().find(Filters.eq("submission_id", submissionId)).first();
            return doc != null ? fromDoc(doc) : null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Submission> getSubmissionsByStudent(int studentId) {
        List<Submission> list = new ArrayList<>();
        try {
            for (Document doc : getCollection()
                    .find(Filters.eq("student_id", studentId))
                    .sort(Sorts.descending("submit_date"))) {
                list.add(fromDoc(doc));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}
