import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import axios from 'axios';
import toast from 'react-hot-toast';
import './Editor.css'; // We'll create this for styling

const Editor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const excalidrawRef = useRef(null);

  const [initialData, setInitialData] = useState(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [loading, setLoading] = useState(true);

  // Fetch project data when the component mounts
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
          withCredentials: true,
        });
        setProjectName(data.name);
        if (data.canvasData) {
          setInitialData(JSON.parse(data.canvasData));
        }
      } catch (error) {
        toast.error("Failed to load project. It might not exist.");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, navigate]);

  const handleSave = async () => {
    if (!excalidrawRef.current) return;

    // 1. Get scene elements from Excalidraw
    const elements = excalidrawRef.current.getSceneElements();
    const canvasDataString = JSON.stringify(elements);

    // 2. Generate a thumbnail image from the canvas
    const blob = await exportToBlob({
      elements,
      mimeType: "image/png",
      appState: {
        gridSize: 20,
        viewBackgroundColor: "#ffffff"
      },
      files: excalidrawRef.current.getFiles(),
    });
    const thumbnailFile = new File([blob], "thumbnail.png", { type: "image/png" });

    // 3. Create FormData to send to the backend
    const formData = new FormData();
    formData.append('name', projectName);
    formData.append('canvasData', canvasDataString);
    formData.append('thumbnail', thumbnailFile);

    // 4. Send the update request
    const toastId = toast.loading('Saving project...');
    try {
      await axios.put(`http://localhost:5000/api/projects/${projectId}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Project saved successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to save project.', { id: toastId });
    }
  };

  if (loading) {
    return <div className="editor-loading">Loading Canvas...</div>;
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <input 
          type="text" 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)}
          className="project-name-input"
        />
        <div className="editor-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">Back to Dashboard</button>
          <button onClick={handleSave} className="btn-primary">Save Project</button>
        </div>
      </div>
      <div className="excalidraw-wrapper">
        <Excalidraw
          ref={excalidrawRef}
          initialData={initialData}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Editor;
