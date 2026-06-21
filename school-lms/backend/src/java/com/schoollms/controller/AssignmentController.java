// backend/src/main/java/com/schoollms/controller/AssignmentController.java
package com.schoollms.controller;

import com.schoollms.dao.AssignmentDAO;
import com.schoollms.dao.SubmissionDAO;
import com.schoollms.model.Assignment;
import com.schoollms.model.Submission;
import com.schoollms.model.User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    private final AssignmentDAO assignmentDAO = new AssignmentDAO();
    private final SubmissionDAO submissionDAO = new SubmissionDAO();

    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentDAO.getAllAssignments();
    }

    @GetMapping("/course/{courseId}")
    public List<Assignment> getAssignmentsByCourse(@PathVariable int courseId) {
        return assignmentDAO.getAssignmentsByCourse(courseId);
    }

    @GetMapping("/{assignmentId}/submissions/status")
    public Map<Integer, Boolean> getSubmissionStatus(@PathVariable int assignmentId, @RequestParam int studentId) {
        Map<Integer, Boolean> status = new HashMap<>();
        status.put(assignmentId, submissionDAO.hasSubmitted(assignmentId, studentId));
        return status;
    }

   // GET /api/assignments/{assignmentId}/submissions/status
@GetMapping("/{assignmentId}/submissions/status")
public Map<Integer, Boolean> getSubmissionStatus(
        @PathVariable int assignmentId, 
        @RequestParam int studentId) {
    Map<Integer, Boolean> status = new HashMap<>();
    status.put(assignmentId, submissionDAO.hasSubmitted(assignmentId, studentId));
    return status;
}

// GET /api/assignments/{assignmentId}/pending-count
@GetMapping("/{assignmentId}/pending-count")
public Map<String, Integer> getPendingCount(@PathVariable int assignmentId) {
    int count = assignmentDAO.getPendingSubmissionsCount(assignmentId);
    return Map.of("pendingCount", count);
}

    @PostMapping
    public Map<String, Boolean> addAssignment(@RequestBody Assignment assignment) {
        boolean success = assignmentDAO.addAssignment(assignment);
        return Map.of("success", success);
    }
}