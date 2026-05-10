package com.taskmanager.demo.service;

import com.taskmanager.demo.model.Role;
import com.taskmanager.demo.model.Task;
import com.taskmanager.demo.model.TaskStatus;
import com.taskmanager.demo.model.User;
import com.taskmanager.demo.repository.TaskRepository;
import com.taskmanager.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public Task createTask(Task task, String email) {
        System.out.println("DEBUG: Attempting to create task by user: " + email);
        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        
        System.out.println("DEBUG: User Role found: " + creator.getRole());
                
        if (creator.getRole() != Role.ADMIN) {
            System.out.println("DEBUG: Role is NOT ADMIN. Blocking request.");
            throw new RuntimeException("Permission Denied: Only Admins can create tasks.");
        }

        // CRITICAL FIX: Ensure project is not null before saving
        if (task.getProject() == null || task.getProject().getId() == null) {
            throw new RuntimeException("Project ID is missing! Cannot create task without a project.");
        }

        // Verify assigned user exists if provided
        if (task.getAssignedTo() != null && task.getAssignedTo().getId() != null) {
            userRepository.findById(task.getAssignedTo().getId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found: User ID " + task.getAssignedTo().getId()));
        }

        return taskRepository.save(task);
    }

    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task updateTaskStatus(Long taskId, TaskStatus status, String email) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != Role.ADMIN && (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(user.getId()))) {
            throw new RuntimeException("You are not authorized to update this task");
        }
        
        task.setStatus(status);
        return taskRepository.save(task);
    }
}
