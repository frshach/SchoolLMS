package com.schoollms.util;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import com.mongodb.client.model.Updates;

public class DBConnection {

    // Defaults to a local MongoDB server (mongodb://localhost:27017)
    // Override via environment variables MONGO_URI / MONGO_DB_NAME for cloud deployment
    private static final String URI = System.getenv("MONGO_URI") != null ?
        System.getenv("MONGO_URI") : "mongodb://localhost:27017";

    private static final String DB_NAME = System.getenv("MONGO_DB_NAME") != null ?
        System.getenv("MONGO_DB_NAME") : "schoollms";

    private static MongoClient client;

    public static synchronized MongoDatabase getDatabase() {
        if (client == null) {
            client = MongoClients.create(URI);
        }
        return client.getDatabase(DB_NAME);
    }

    // Generates auto-incrementing integer IDs (replaces MySQL AUTO_INCREMENT)
    public static int getNextSequence(String counterName) {
        MongoDatabase db = getDatabase();
        Document result = db.getCollection("counters").findOneAndUpdate(
            Filters.eq("_id", counterName),
            Updates.inc("seq", 1),
            new FindOneAndUpdateOptions()
                .upsert(true)
                .returnDocument(ReturnDocument.AFTER)
        );
        return result.getInteger("seq");
    }
}
