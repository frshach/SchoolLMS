// backend/src/main/java/com/schoollms/controller/SubmissionController.java
package backend.src.java.com.schoollms.controller;

import com.schoollms.dao.SubmissionDAO;
import com.schoollms.model.Submission;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionDAO dao = new SubmissionDAO();

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getSubmissionsByAssignment(@PathVariable int assignmentId) {
        return dao.getSubmissionsByAssignment(assignmentId);
    }

    @GetMapping("/student/{studentId}")
    public List<Submission> getSubmissionsByStudent(@PathVariable int studentId) {
        return dao.getSubmissionsByStudent(studentId);
    }

    @PostMapping("/submit")
    public Map<String, Boolean> submitAssignment(
            @RequestParam("assignmentId") int assignmentId,
            @RequestParam("studentId") int studentId,
            @RequestParam("submissionNotes") String submissionNotes,
            @RequestParam("file") MultipartFile file) throws IOException {

        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String savedFileName = UUID.randomUUID().toString() + extension;
        String fullPath = uploadPath.resolve(savedFileName).toString();

        // Save file
        file.transferTo(Path.of(fullPath));

        Submission submission = new Submission();
        submission.setAssignmentId(assignmentId);
        submission.setStudentId(studentId);
        submission.setFileName(originalFilename);
        submission.setFilePath(fullPath);
        submission.setSubmissionNotes(submissionNotes);

        boolean success = dao.submitAssignment(submission);
        return Map.of("success", success);
    }

    @PostMapping("/grade")
    public Map<String, Boolean> gradeSubmission(@RequestBody Map<String, String> request) {
        int submissionId = Integer.parseInt(request.get("submissionId"));
        double grade = Double.parseDouble(request.get("grade"));
        String feedback = request.get("feedback");

        boolean success = dao.gradeSubmission(submissionId, grade, feedback);
        return Map.of("success", success);
    }

    @GetMapping("/download/{submissionId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable int submissionId) {
        Submission submission = dao.getSubmissionById(submissionId);
        if (submission == null || submission.getFilePath() == null) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(submission.getFilePath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + submission.getFileName() + "\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource);
    }
}