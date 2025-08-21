const Project = require("../models/Project");
const cloudinary = require('../config/cloudinary');

// Helper function to extract public ID from Cloudinary URL for deletion
const getPublicId = (url) => {
  try {
    const parts = url.split('/');
    const publicIdWithFormat = parts[parts.length - 1];
    const publicId = publicIdWithFormat.split('.')[0];
    return `project_thumbnails/${publicId}`; 
  } catch (error) {
    console.error("Could not extract public ID from URL:", url);
    return null;
  }
};

// @desc    Get all projects (no user filtering)
// @route   GET /api/projects/user
exports.getUserProjects = async (req, res) => {
  try {
    console.log("Fetching all projects...");
    const projects = await Project.find({}).sort({ updatedAt: -1 });
    console.log(`Found ${projects.length} projects`);
    res.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all projects (alternative route)
// @route   GET /api/projects
exports.getAllProjects = async (req, res) => {
  try {
    console.log("Fetching all projects from root route...");
    const projects = await Project.find({}).sort({ updatedAt: -1 });
    console.log(`Found ${projects.length} projects`);
    res.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    console.log("Fetching project with ID:", req.params.id);
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      console.log("Project not found");
      return res.status(404).json({ message: "Project not found" });
    }
    
    console.log("Project found:", project.name);
    res.json(project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
exports.createProject = async (req, res) => {
  try {
    console.log("Creating new project...");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { name, description } = req.body;
    const thumbnailUrl = req.file ? (req.file.path || req.file.secure_url || "") : "";

    const projectData = {
      name: name || "Untitled Project",
      description: description || "",
      thumbnail: thumbnailUrl,
      canvasData: {} // Initialize with empty canvas data
    };

    console.log("Project data to save:", projectData);

    const project = new Project(projectData);
    const createdProject = await project.save();
    
    console.log("Project created successfully:", createdProject._id);
    res.status(201).json(createdProject);
  } catch (error) {
    console.error("Failed to create project:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: "Validation Error", errors: messages });
    }
    res.status(500).json({ 
      message: "Internal Server Error: Could not create project.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update an existing project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    console.log("Updating project with ID:", req.params.id);
    console.log("Update data:", req.body);
    console.log("New file:", req.file);

    const { name, description, canvasData } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      console.log("Project not found for update");
      return res.status(404).json({ message: "Project not found" });
    }

    // Update fields
    project.name = name !== undefined ? name : project.name;
    project.description = description !== undefined ? description : project.description;
    project.canvasData = canvasData !== undefined ? canvasData : project.canvasData;

    // Handle thumbnail update
    if (req.file) {
      // Delete old thumbnail from cloudinary if it exists
      if (project.thumbnail) {
        const publicId = getPublicId(project.thumbnail);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log("Old thumbnail deleted from cloudinary");
          } catch (cloudinaryError) {
            console.error("Error deleting old thumbnail:", cloudinaryError);
            // Don't fail the update if cloudinary deletion fails
          }
        }
      }
      project.thumbnail = req.file.path || req.file.secure_url || "";
    }

    const updatedProject = await project.save();
    console.log("Project updated successfully:", updatedProject._id);
    res.json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "Project not found" });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: "Validation Error", errors: messages });
    }
    res.status(500).json({ 
      message: "Failed to update project",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    console.log("Deleting project with ID:", req.params.id);
    const project = await Project.findById(req.params.id);

    if (!project) {
      console.log("Project not found for deletion");
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete thumbnail from cloudinary if it exists
    if (project.thumbnail) {
      const publicId = getPublicId(project.thumbnail);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log("Thumbnail deleted from cloudinary");
        } catch (cloudinaryError) {
          console.error("Error deleting thumbnail from cloudinary:", cloudinaryError);
          // Don't fail the deletion if cloudinary deletion fails
        }
      }
    }

    await project.deleteOne();
    console.log("Project deleted successfully");
    res.json({ message: "Project removed successfully" });
  } catch (error) {
    console.error("Failed to delete project:", error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(500).json({ 
      message: "Failed to delete project",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Duplicate a project
// @route   POST /api/projects/:id/duplicate
exports.duplicateProject = async (req, res) => {
  try {
    console.log("Duplicating project with ID:", req.params.id);
    const originalProject = await Project.findById(req.params.id);

    if (!originalProject) {
      console.log("Original project not found for duplication");
      return res.status(404).json({ message: "Project not found" });
    }

    const duplicateData = {
      name: `${originalProject.name} (Copy)`,
      description: originalProject.description,
      canvasData: originalProject.canvasData,
      thumbnail: "", // Don't copy thumbnail, let user upload new one
    };

    const duplicateProject = new Project(duplicateData);
    const savedDuplicate = await duplicateProject.save();
    
    console.log("Project duplicated successfully:", savedDuplicate._id);
    res.status(201).json(savedDuplicate);
  } catch (error) {
    console.error("Failed to duplicate project:", error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(500).json({ 
      message: "Failed to duplicate project",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
exports.getProjectStats = async (req, res) => {
  try {
    console.log("Fetching project statistics...");
    
    const totalProjects = await Project.countDocuments();
    const recentProjects = await Project.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });
    
    const projectsWithThumbnails = await Project.countDocuments({
      thumbnail: { $ne: "" }
    });

    const stats = {
      total: totalProjects,
      recentlyCreated: recentProjects,
      withThumbnails: projectsWithThumbnails,
      withoutThumbnails: totalProjects - projectsWithThumbnails
    };

    console.log("Project stats:", stats);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching project stats:", error);
    res.status(500).json({ message: "Failed to fetch project statistics" });
  }
};

// @desc    Search projects by name
// @route   GET /api/projects/search?q=searchterm
exports.searchProjects = async (req, res) => {
  try {
    const { q } = req.query;
    console.log("Searching projects with query:", q);

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const projects = await Project.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).sort({ updatedAt: -1 });

    console.log(`Found ${projects.length} projects matching "${q}"`);
    res.json({ projects, query: q });
  } catch (error) {
    console.error("Error searching projects:", error);
    res.status(500).json({ message: "Failed to search projects" });
  }
};