package com.taskmanager.demo.service;

import com.taskmanager.demo.model.Project;
import com.taskmanager.demo.model.Role;
import com.taskmanager.demo.model.User;
import com.taskmanager.demo.repository.ProjectRepository;
import com.taskmanager.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project createProject(Project project, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only Admins can create projects");
        }
        project.setCreatedBy(user);
        return projectRepository.save(project);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
    }
}
