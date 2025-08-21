import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import './customer.css'; // Your existing CSS file

const CustomerComponent = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's projects when the component loads
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/projects/user", {
          withCredentials: true,
        });
        setProjects(data.projects || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Function to handle creating a new project
// Function to handle creating a new project
const handleCreateNewProject = async () => {
  const toastId = toast.loading('Creating new project...');
  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/projects',
      { name: 'New Untitled Project' },
      { withCredentials: true }
    );
    const newProjectId = data._id; // Note: should be _id not \_id
    toast.success('Project created!', { id: toastId });
    navigate(`/editor/${newProjectId}`);
  } catch (error) {
    // Better error logging
    console.error('Create project error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    const errorMessage = error.response?.data?.message || 'Could not create a new project.';
    toast.error(errorMessage, { id: toastId });
  }
};


  // Function to handle clicking on an existing project
  const handleProjectClick = (projectId) => {
    navigate(`/editor/${projectId}`);
  };

  return (
    <div className="customer-dashboard">
      <header className="projects-header">
        <h2>My Designs</h2>
        <button onClick={handleCreateNewProject} className="btn-create-project">
          + Start a New Project
        </button>
      </header>

      <main className="projects-grid-container">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="no-projects-message">
            <h3>No designs yet!</h3>
            <p>Click "Start a New Project" to begin creating.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                className="project-card"
                onClick={() => handleProjectClick(project._id)}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="project-thumbnail">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} />
                  ) : (
                    <div className="no-thumbnail-placeholder">🎨</div>
                  )}
                </div>
                <div className="project-info">
                  <h4 className="project-name">{project.name}</h4>
                  <p className="project-date">
                    Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerComponent;
