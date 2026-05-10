package com.taskmanager.demo.service;

import com.taskmanager.demo.model.Project;
import com.taskmanager.demo.model.Role;
import com.taskmanager.demo.model.User;
import com.taskmanager.demo.repository.ProjectRepository;
import com.taskmanager.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createProject_AsAdmin_Success() {
        // Arrange
        String email = "admin@test.com";
        User admin = new User();
        admin.setEmail(email);
        admin.setRole(Role.ADMIN);

        Project project = new Project();
        project.setName("New Project");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(admin));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        // Act
        Project result = projectService.createProject(project, email);

        // Assert
        assertNotNull(result);
        assertEquals(admin, result.getCreatedBy());
        verify(projectRepository, times(1)).save(project);
    }

    @Test
    void createProject_AsMember_ShouldThrowException() {
        // Arrange
        String email = "member@test.com";
        User member = new User();
        member.setEmail(email);
        member.setRole(Role.MEMBER);

        Project project = new Project();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(member));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectService.createProject(project, email);
        });

        assertTrue(exception.getMessage().contains("Only Admins can create projects"));
        verify(projectRepository, never()).save(any(Project.class));
    }
}
