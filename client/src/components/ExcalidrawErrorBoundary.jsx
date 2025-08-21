
// components/ExcalidrawErrorBoundary.js - Error boundary for Excalidraw crashes
import React from 'react';
import { toast } from 'react-hot-toast';

class ExcalidrawErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Excalidraw Error Boundary Caught Error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Show toast notification
    toast.error('Canvas crashed. Click "Reset Canvas" to recover.', {
      duration: 8000,
      icon: '🚨'
    });

    // Log error details for debugging
    console.error('Error details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  handleReset = () => {
    console.log('🔄 Resetting Excalidraw error boundary');
    
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: this.state.retryCount + 1
    });

    // Clear any corrupted data and restart
    if (this.props.onReset) {
      this.props.onReset();
    }

    toast.success('Canvas reset successfully!', {
      duration: 3000,
      icon: '✅'
    });
  };

  handleReload = () => {
    console.log('🔄 Reloading page to recover from error');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="excalidraw-error-fallback">
          <div className="error-content">
            <div className="error-icon">🚨</div>
            <h2>Canvas Error</h2>
            <p>The drawing canvas encountered an error and crashed.</p>
            
            {this.state.retryCount < 3 ? (
              <div className="error-actions">
                <button 
                  onClick={this.handleReset}
                  className="btn-primary error-btn"
                >
                  🔄 Reset Canvas
                </button>
                <button 
                  onClick={this.handleReload}
                  className="btn-secondary error-btn"
                >
                  🔄 Reload Page
                </button>
              </div>
            ) : (
              <div className="error-actions">
                <p className="error-warning">
                  Multiple reset attempts failed. Please reload the page.
                </p>
                <button 
                  onClick={this.handleReload}
                  className="btn-primary error-btn"
                >
                  🔄 Reload Page
                </button>
              </div>
            )}

            {/* Debug information (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>🔍 Error Details (Development Only)</summary>
                <div className="error-stack">
                  <h4>Error Message:</h4>
                  <pre>{this.state.error.toString()}</pre>
                  
                  <h4>Component Stack:</h4>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                  
                  <h4>Error Stack:</h4>
                  <pre>{this.state.error.stack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ExcalidrawErrorBoundary;