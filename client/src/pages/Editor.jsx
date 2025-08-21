
// components/Editor.js - Optimized version
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ExcalidrawErrorBoundary from '../components/ExcalidrawErrorBoundary';
import './Editor.css'; 

const debounce = (fn, delay) => {
  let timeoutId;
  const debounced = (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
};

// Clean appState to prevent Excalidraw crashes
const cleanAppState = (appState) => {
  if (!appState || typeof appState !== 'object') return {};
  
  const cleanedState = { ...appState };
  
  // Remove problematic properties
  const removeKeys = [
    'collaborators', 'isCollaborating', 'collaboratorCursor', 'activeEmbeddable',
    'openMenu', 'openPopup', 'lastPointerDownTarget', 'draggingElement',
    'resizingElement', 'editingElement', 'editingGroupId', 'editingLinearElement',
    'activeTool', 'openSidebar'
  ];
  
  removeKeys.forEach(key => delete cleanedState[key]);
  
  // Remove invalid numeric values
  Object.keys(cleanedState).forEach(key => {
    const value = cleanedState[key];
    if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
      delete cleanedState[key];
    }
  });
  
  // Set safe defaults
  return {
    gridSize: null,
    viewBackgroundColor: '#ffffff',
    exportBackground: true,
    theme: 'light',
    viewModeEnabled: false,
    zenModeEnabled: false,
    zoom: { value: 1 },
    scrollX: 0,
    scrollY: 0,
    ...cleanedState
  };
};

const Editor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const excalidrawRef = useRef(null);

  const [initialData, setInitialData] = useState(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [loading, setLoading] = useState(true);
  const [excalidrawReady, setExcalidrawReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [hasDataCorruption, setHasDataCorruption] = useState(false);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setLoading(false);
        toast.error("Invalid project ID");
        navigate('/dashboard');
        return;
      }

      try {
        const { data } = await axios.get(`https://matty-u3pp.onrender.com/api/projects/${projectId}`, {
          withCredentials: true,
          timeout: 10000,
        });
        
        setProjectName(data.name || 'Untitled Project');
        
        if (data.canvasData) {
          try {
            const parsedData = typeof data.canvasData === 'string' 
              ? JSON.parse(data.canvasData) 
              : data.canvasData;
            
            const cleanElements = (parsedData.elements || []).filter(element => 
              element && element.type && element.id && !isNaN(element.x) && !isNaN(element.y)
            );
            
            if (cleanElements.length !== (parsedData.elements || []).length) {
              setHasDataCorruption(true);
            }

            setInitialData({
              elements: cleanElements,
              files: parsedData.files || {},
              appState: cleanAppState(parsedData.appState)
            });
          } catch (parseError) {
            console.error("Failed to parse canvas data:", parseError);
            setHasDataCorruption(true);
            setInitialData({ elements: [], files: {}, appState: cleanAppState({}) });
            toast.error('Canvas data was corrupted. Starting with empty canvas.');
          }
        } else {
          setInitialData({ elements: [], files: {}, appState: cleanAppState({}) });
        }
      } catch (error) {
        console.error("Failed to load project:", error);
        const errorMessage = error.response?.status === 404 ? "Project not found" : "Failed to load project";
        toast.error(errorMessage);
        setTimeout(() => navigate('/dashboard'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate, resetKey]);

  // Handle error boundary reset
  const handleErrorReset = useCallback(() => {
    setExcalidrawAPI(null);
    setExcalidrawReady(false);
    setSaveStatus('Saved');
    setHasDataCorruption(false);
    setInitialData({ elements: [], files: {}, appState: cleanAppState({}) });
    setResetKey(prev => prev + 1);
  }, []);

  // Handle Excalidraw API
  const handleExcalidrawAPI = useCallback((api) => {
    if (api) {
      setExcalidrawAPI(api);
      setTimeout(() => {
        setExcalidrawReady(true);
        if (hasDataCorruption) {
          toast.warning('Some corrupted elements were removed from the canvas.', {
            duration: 5000,
            icon: '⚠️'
          });
        }
      }, 200);
    }
  }, [hasDataCorruption]);

  // Save project
  const saveProject = useCallback(async () => {
    const excalidrawInstance = excalidrawAPI || excalidrawRef.current;
    
    if (!excalidrawInstance || loading || saveStatus === 'Saving...' || !projectId) {
      return;
    }
    
    setSaveStatus('Saving...');
    
    try {
      let elements = [];
      let files = {};
      let appState = {};
      
      try {
        elements = excalidrawInstance.getSceneElements?.() || [];
        files = excalidrawInstance.getFiles?.() || {};
        appState = cleanAppState(excalidrawInstance.getAppState?.() || {});
        
        // Filter valid elements
        elements = elements.filter(element => 
          element && element.type && element.id && !isNaN(element.x) && !isNaN(element.y)
        );
      } catch (excalidrawError) {
        console.warn("Error extracting data from Excalidraw:", excalidrawError);
        elements = [];
        files = {};
        appState = cleanAppState({});
      }

      const canvasData = { elements, files, appState };
      const canvasDataString = JSON.stringify(canvasData);

      // Generate thumbnail
      let thumbnailBlob;
      try {
        if (elements.length > 0) {
          thumbnailBlob = await exportToBlob({
            elements,
            files,
            mimeType: "image/png",
            appState: { 
              gridSize: 20, 
              viewBackgroundColor: "#ffffff",
              exportBackground: true,
              exportWithDarkMode: false
            },
            getDimensions: (width, height) => {
              const maxSize = 400;
              const scale = Math.min(maxSize / width, maxSize / height, 1);
              return {
                width: Math.max(width * scale, 100),
                height: Math.max(height * scale, 100),
                scale
              };
            }
          });
        } else {
          // Create placeholder thumbnail
          const canvas = document.createElement('canvas');
          canvas.width = 200;
          canvas.height = 150;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, 200, 150);
          ctx.strokeStyle = '#cccccc';
          ctx.strokeRect(10, 10, 180, 130);
          ctx.fillStyle = '#999999';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Empty Canvas', 100, 80);
          thumbnailBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        }
      } catch (thumbnailError) {
        console.warn("Thumbnail generation failed:", thumbnailError.message);
        thumbnailBlob = new Blob([''], { type: 'image/png' });
      }

      // Send save request
      const formData = new FormData();
      formData.append('name', projectName.trim() || 'Untitled Project');
      formData.append('canvasData', canvasDataString);
      formData.append('thumbnail', new File([thumbnailBlob], "thumbnail.png", { type: "image/png" }));

      await axios.put(`https://matty-u3pp.onrender.com/api/projects/${projectId}`, formData, {
        withCredentials: true,
        timeout: 300000,
      });
      
      setSaveStatus('Saved');
      setLastSaveTime(new Date());
      toast.success('Project saved successfully!');
      
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus('Error');
      const errorMessage = error.response?.data?.message || 'Failed to save project';
      toast.error(errorMessage);
    }
  }, [projectName, projectId, loading, saveStatus, excalidrawAPI]);

  const debouncedSave = useMemo(() => debounce(saveProject, 30000), [saveProject]);
  
  useEffect(() => () => debouncedSave.cancel(), [debouncedSave]);

  // Event handlers
  const handleManualSave = useCallback(() => {
    debouncedSave.cancel();
    saveProject();
  }, [debouncedSave, saveProject]);
  
  const handleContentChange = useCallback(() => {
    if (saveStatus !== 'Saving...') {
      setSaveStatus('Unsaved');
      debouncedSave();
    }
  }, [debouncedSave, saveStatus]);

  const handleProjectNameChange = useCallback((e) => {
    setProjectName(e.target.value);
    handleContentChange();
  }, [handleContentChange]);

  const handleNavigation = useCallback(() => {
    if (saveStatus === 'Unsaved' || saveStatus === 'Saving...') {
      const shouldSave = window.confirm('You have unsaved changes. Save before leaving?');
      if (shouldSave) {
        debouncedSave.cancel();
        saveProject().finally(() => {
          setTimeout(() => navigate('/dashboard'), 500);
        });
        return;
      }
    }
    navigate('/dashboard');
  }, [saveStatus, debouncedSave, saveProject, navigate]);

  const handleEmergencyReset = useCallback(() => {
    if (window.confirm('This will reset the canvas to empty state. Are you sure? This cannot be undone.')) {
      handleErrorReset();
      toast.success('Canvas has been reset to empty state.');
    }
  }, [handleErrorReset]);

  if (loading || !initialData) {
    return (
      <div className="editor-loading">
        <div className="loading-spinner"></div>
        <p>{loading ? 'Loading Canvas...' : 'Preparing Canvas...'}</p>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="project-info">
          <input 
            type="text" 
            value={projectName} 
            onChange={handleProjectNameChange}
            className="project-name-input"
            placeholder="Enter project name..."
            maxLength={100}
          />
          {lastSaveTime && (
            <span className="last-save-time">
              Last saved: {lastSaveTime.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <div className="editor-actions">
          <span className={`save-status status-${saveStatus.toLowerCase().replace(/\s+/g, '-')}`}>
            {saveStatus}
          </span>
          
          {!excalidrawReady && (
            <span className="excalidraw-status">Canvas Loading...</span>
          )}
          
          {hasDataCorruption && (
            <span className="corruption-warning" title="Some corrupted data was detected and cleaned">
              ⚠️ Data Cleaned
            </span>
          )}
          
          <button 
            onClick={handleEmergencyReset}
            className="btn-danger btn-small"
            title="Emergency reset - clears all canvas data"
          >
            🚨 Reset
          </button>
          
          <button onClick={handleNavigation} className="btn-secondary">
            Dashboard
          </button>
          
          <button 
            onClick={handleManualSave} 
            className="btn-primary" 
            disabled={saveStatus === 'Saving...'}
          >
            {saveStatus === 'Saving...' ? (
              <>
                <span className="saving-spinner"></span>
                Saving...
              </>
            ) : (
              'Save Now'
            )}
          </button>
        </div>
      </div>
      
      <div className="excalidraw-wrapper">
        <ExcalidrawErrorBoundary onReset={handleErrorReset}>
          <Excalidraw
            key={resetKey}
            ref={excalidrawRef}
            initialData={initialData}
            onChange={handleContentChange}
            excalidrawAPI={handleExcalidrawAPI}
            theme="light"
            langCode="en"
            gridModeEnabled={true}
            zenModeEnabled={false}
            viewModeEnabled={false}
          />
        </ExcalidrawErrorBoundary>
      </div>
    </div>
  );
};

export default Editor;