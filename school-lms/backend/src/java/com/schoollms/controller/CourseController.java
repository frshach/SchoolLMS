// backend/src/main/java/com/schoollms/controller/CourseController.java
package backend.src.java.com.schoollms.controller;

import com.schoollms.dao.CourseDAO;
import com.schoollms.model.Course;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseDAO dao = new CourseDAO();

    @GetMapping
    public List<Course> getAllCourses() {
        return dao.getAllCourses();
    }

    @PostMapping
    public Map<String, Boolean> addCourse(@RequestBody Course course) {
        boolean success = dao.addCourse(course);
        return Map.of("success", success);
    }
}