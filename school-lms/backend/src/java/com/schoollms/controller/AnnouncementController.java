// backend/src/main/java/com/schoollms/controller/AnnouncementController.java
package com.schoollms.controller;

import com.schoollms.dao.AnnouncementDAO;
import com.schoollms.model.Announcement;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    private final AnnouncementDAO dao = new AnnouncementDAO();

    @GetMapping
    public List<Announcement> getAllAnnouncements() {
        return dao.getAllAnnouncements();
    }

    @PostMapping
    public Map<String, Boolean> addAnnouncement(@RequestBody Announcement announcement) {
        boolean success = dao.addAnnouncement(announcement);
        return Map.of("success", success);
    }

    @PutMapping("/{id}")
    public Map<String, Boolean> updateAnnouncement(@PathVariable int id, @RequestBody Announcement announcement) {
        announcement.setAnnouncementId(id);
        boolean success = dao.updateAnnouncement(announcement);
        return Map.of("success", success);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> deleteAnnouncement(@PathVariable int id) {
        boolean success = dao.deleteAnnouncement(id);
        return Map.of("success", success);
    }
}