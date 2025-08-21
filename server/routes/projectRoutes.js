// In routes/projectRoutes.js
const express = require("express");
const { 
  getUserProjects, 
  getAllProjects,
  createProject, 
  getProjectById, 
  updateProject, 
  deleteProject,
  duplicateProject,
  getProjectStats,
  searchProjects
} = require("../controllers/projectController");

// Correctly importing the optionalUpload middleware
const optionalUpload = require('../middlewares/uploadMiddleware');
const router = express.Router();

// Search projects route (must come before /:id route)
router.get("/search", searchProjects);

// Statistics route
router.get("/stats", getProjectStats);

// Routes for the collection of projects
router.route("/")
  .get(getAllProjects)
  // FIX: Added optionalUpload middleware to the createProject route
  // This allows a thumbnail to be optionally uploaded during creation.
  .post(optionalUpload, createProject); 

// Route to get user projects (alternative endpoint)
router.route("/user")
  .get(getUserProjects);

// Routes for a single project, identified by its ID
router.route("/:id")
  .get(getProjectById)
  // Use optionalUpload middleware for thumbnail upload on update
  .put(optionalUpload, updateProject) 
  .delete(deleteProject);

// Duplicate project route
router.route("/:id/duplicate")
  .post(duplicateProject);

module.exports = router;
