package com.schoollms.dao;

import com.schoollms.model.Assignment;
import com.schoollms.util.DBConnection;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import org.bson.Document;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

public class AssignmentDAO {

    private MongoCollection<Document> getCollection() {
        return DBConnection.getDatabase().getCollection("assignments");
    }

    private Assignment fromDoc(Document doc) {
        Assignment a = new Assignment();
        a.setAssignmentId(doc.getInteger("assignment_id"));
        a.setCourseId(doc.getInteger("course_id"));
        a.setTitle(doc.getString("title"));
        a.setDescription(doc.getString("description"));
        java.util.Date d = doc.getDate("due_date");
        if (d != null) a.setDueDate(new Date(d.getTime()));
        return a;
    }

    public boolean addAssignment(Assignment assignment) {
        try {
            int newId = DBConnection.getNextSequence("assignment_id");
            Document doc = new Document("assignment_id", newId)
                    .append("course_id", assignment.getCourseId())
                    .append("title", assignment.getTitle())
                    .append("description", assignment.getDescription())
                    .append("due_date", assignment.getDueDate() != null ?
                        new java.util.Date(assignment.getDueDate().getTime()) : null);
            getCollection().insertOne(doc);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Assignment> getAllAssignments() {
        List<Assignment> list = new ArrayList<>();
        try {
            for (Document doc : getCollection().find()) {
                list.add(fromDoc(doc));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Assignment> getAssignmentsByCourse(int courseId) {
        List<Assignment> list = new ArrayList<>();
        try {
            for (Document doc : getCollection().find(Filters.eq("course_id", courseId))) {
                list.add(fromDoc(doc));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public int getPendingSubmissionsCount(int assignmentId) {
        try {
            MongoCollection<Document> submissions =
                DBConnection.getDatabase().getCollection("submissions");

            return (int) submissions.countDocuments(
                Filters.and(
                    Filters.eq("assignment_id", assignmentId),
                    Filters.or(
                        Filters.exists("grade", false),
                        Filters.eq("grade", null),
                        Filters.eq("grade", 0.0)
                    )
                )
            );
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
