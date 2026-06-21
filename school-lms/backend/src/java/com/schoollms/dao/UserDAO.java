package com.schoollms.dao;

import com.schoollms.model.User;
import com.schoollms.util.DBConnection;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import org.bson.Document;

public class UserDAO {

    private MongoCollection<Document> getCollection() {
        return DBConnection.getDatabase().getCollection("users");
    }

    public boolean registerUser(User user) {
        try {
            int newId = DBConnection.getNextSequence("user_id");
            Document doc = new Document("user_id", newId)
                    .append("fullname", user.getFullname())
                    .append("email", user.getEmail())
                    .append("password", user.getPassword())
                    .append("role", user.getRole());
            getCollection().insertOne(doc);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public User login(String email, String password) {
        try {
            Document doc = getCollection().find(
                Filters.and(Filters.eq("email", email), Filters.eq("password", password))
            ).first();

            if (doc == null) return null;

            User user = new User();
            user.setUserId(doc.getInteger("user_id"));
            user.setFullname(doc.getString("fullname"));
            user.setEmail(doc.getString("email"));
            user.setRole(doc.getString("role"));
            return user;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
