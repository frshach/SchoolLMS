package com.schoollms.model;

import java.sql.Timestamp;

public class Submission {
    private int submissionId;
    private int assignmentId;
    private int studentId;
    private String fileName;
    private String filePath;
    private Timestamp submitDate;
    private double grade;
    private String feedback;
    private String submissionNotes; // Atribut baharu

    public Submission() {}

    public int getSubmissionId() { return submissionId; }
    public void setSubmissionId(int submissionId) { this.submissionId = submissionId; }

    public int getAssignmentId() { return assignmentId; }
    public void setAssignmentId(int assignmentId) { this.assignmentId = assignmentId; }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public Timestamp getSubmitDate() { return submitDate; }
    public void setSubmitDate(Timestamp submitDate) { this.submitDate = submitDate; }

    public double getGrade() { return grade; }
    public void setGrade(double grade) { this.grade = grade; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getSubmissionNotes() { return submissionNotes; }
    public void setSubmissionNotes(String submissionNotes) { this.submissionNotes = submissionNotes; }
}