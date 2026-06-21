package com.schoollms.dao;

import com.schoollms.model.Announcement;
import com.schoollms.util.DBConnection;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.model.Updates;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class AnnouncementDAO {

    private MongoCollection<Document> getCollection() {
        return DBConnection.getDatabase().getCollection("announcements");
    }

    public boolean addAnnouncement(Announcement announcement) {
        try {
            int newId = DBConnection.getNextSequence("announcement_id");
            Document doc = new Document("announcement_id", newId)
                    .append("course_id", announcement.getCourseId())
                    .append("title", announcement.getTitle())
                    .append("message", announcement.getMessage());
            getCollection().insertOne(doc);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Announcement> getAllAnnouncements() {
        List<Announcement> list = new ArrayList<>();
        try {
            for (Document doc : getCollection().find().sort(Sorts.descending("announcement_id"))) {
                Announcement a = new Announcement();
                a.setAnnouncementId(doc.getInteger("announcement_id"));
                a.setCourseId(doc.getInteger("course_id"));
                a.setTitle(doc.getString("title"));
                a.setMessage(doc.getString("message"));
                list.add(a);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean updateAnnouncement(Announcement announcement) {
        try {
            return getCollection().updateOne(
                Filters.eq("announcement_id", announcement.getAnnouncementId()),
                Updates.combine(
                    Updates.set("course_id", announcement.getCourseId()),
                    Updates.set("title", announcement.getTitle()),
                    Updates.set("message", announcement.getMessage())
                )
            ).getModifiedCount() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteAnnouncement(int announcementId) {
        try {
            return getCollection().deleteOne(Filters.eq("announcement_id", announcementId)).getDeletedCount() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
