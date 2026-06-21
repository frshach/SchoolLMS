package com.schoollms.dao;

import com.schoollms.model.Course;
import com.schoollms.util.DBConnection;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class CourseDAO {

    private MongoCollection<Document> getCollection() {
        return DBConnection.getDatabase().getCollection("courses");
    }

    public boolean addCourse(Course course) {
        try {
            int newId = DBConnection.getNextSequence("course_id");
            Document doc = new Document("course_id", newId)
                    .append("course_name", course.getCourseName())
                    .append("description", course.getDescription())
                    .append("teacher_id", course.getTeacherId());
            getCollection().insertOne(doc);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Course> getAllCourses() {
        List<Course> list = new ArrayList<>();
        try {
            for (Document doc : getCollection().find()) {
                Course c = new Course();
                c.setCourseId(doc.getInteger("course_id"));
                c.setCourseName(doc.getString("course_name"));
                c.setDescription(doc.getString("description"));
                c.setTeacherId(doc.getInteger("teacher_id"));
                list.add(c);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}
