// backend/src/main/java/com/schoollms/controller/DashboardController.java
package backend.src.java.com.schoollms.controller;

import com.schoollms.dao.AssignmentDAO;
import com.schoollms.dao.CourseDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final CourseDAO courseDAO = new CourseDAO();
    private final AssignmentDAO assignmentDAO = new AssignmentDAO();

    @GetMapping("/metrics")
    public Map<String, Integer> getMetrics() {
        Map<String, Integer> metrics = new HashMap<>();
        metrics.put("courseCount", courseDAO.getAllCourses().size());
        metrics.put("assignmentCount", assignmentDAO.getAllAssignments().size());
        return metrics;
    }
}