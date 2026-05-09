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
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only Admins can create tasks");
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
