package com.taskmanager.demo.controller;

import com.taskmanager.demo.repository.ProjectRepository;
import com.taskmanager.demo.repository.TaskRepository;
import com.taskmanager.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public Map<String, Object> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        try {
            status.put("database", "connected");
            status.put("users_count", userRepository.count());
            status.put("projects_count", projectRepository.count());
            status.put("tasks_count", taskRepository.count());
        } catch (Exception e) {
            status.put("database", "error");
            status.put("message", e.getMessage());
        }
        return status;
    }
}
