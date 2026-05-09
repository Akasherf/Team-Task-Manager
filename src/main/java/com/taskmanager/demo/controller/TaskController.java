package com.taskmanager.demo.controller;

import com.taskmanager.demo.model.Task;
import com.taskmanager.demo.model.TaskStatus;
import com.taskmanager.demo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin("*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public Task createTask(@RequestBody Task task, Authentication authentication) {
        return taskService.createTask(task, authentication.getName());
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProjectId(@PathVariable Long projectId) {
        return taskService.getTasksByProjectId(projectId);
    }

    @PutMapping("/{id}/status")
    public Task updateTaskStatus(@PathVariable Long id, @RequestParam TaskStatus status, Authentication authentication) {
        return taskService.updateTaskStatus(id, status, authentication.getName());
    }
}
