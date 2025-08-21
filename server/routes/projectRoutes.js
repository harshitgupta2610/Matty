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

// Authentication middleware (commented out for now)
// const { protect } = require("../middlewares/auth"); 

const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

// Apply the 'protect' middleware to all routes (commented out for now)
// router.use(protect);

// Search projects route (must come before /:id route)
router.get("/search", searchProjects);

// Statistics route
router.get("/stats", getProjectStats);

// Routes for the collection of projects
router.route("/")
  .get(getAllProjects)
  .post(createProject); // No upload middleware for now

// Route to get user projects (alternative endpoint)
router.route("/user")
  .get(getUserProjects);

// Routes for a single project, identified by its ID
router.route("/:id")
  .get(getProjectById)
    .put(upload, updateProject) // Use upload middleware for thumbnail upload
  .delete(deleteProject);

// Duplicate project route
router.route("/:id/duplicate")
  .post(duplicateProject);

module.exports = router;