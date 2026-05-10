package com.taskmanager.demo.service;

import com.taskmanager.demo.model.Project;
import com.taskmanager.demo.model.Role;
import com.taskmanager.demo.model.Task;
import com.taskmanager.demo.model.User;
import com.taskmanager.demo.repository.ProjectRepository;
import com.taskmanager.demo.repository.TaskRepository;
import com.taskmanager.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTask_AsAdmin_Success() {
        // Arrange
        String email = "admin@test.com";
        User admin = new User();
        admin.setEmail(email);
        admin.setRole(Role.ADMIN);

        Project project = new Project();
        project.setId(1L);

        Task task = new Task();
        task.setProject(project);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(admin));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        // Act
        Task result = taskService.createTask(task, email);

        // Assert
        assertNotNull(result);
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void createTask_AsMember_ShouldThrowException() {
        // Arrange
        String email = "member@test.com";
        User member = new User();
        member.setEmail(email);
        member.setRole(Role.MEMBER);

        Task task = new Task();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(member));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.createTask(task, email);
        });

        assertTrue(exception.getMessage().contains("Permission Denied"));
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void createTask_MissingProject_ShouldThrowException() {
        // Arrange
        String email = "admin@test.com";
        User admin = new User();
        admin.setRole(Role.ADMIN);

        Task task = new Task(); // No project set

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(admin));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            taskService.createTask(task, email);
        });

        assertTrue(exception.getMessage().contains("Project ID is missing"));
    }
}
