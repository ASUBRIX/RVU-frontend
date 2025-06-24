import React from 'react';
import { Alert, Button, Card } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-4">
          <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">⚠️ Something went wrong</h4>
            </Card.Header>
            <Card.Body>
              <Alert variant="danger">
                <h5>Error Details:</h5>
                <p><strong>Message:</strong> {this.state.error?.message}</p>
                <p><strong>Component:</strong> {this.props.componentName || 'Unknown'}</p>
                
                {this.state.error?.stack && (
                  <details className="mt-3">
                    <summary>Stack Trace</summary>
                    <pre className="small mt-2 p-2 bg-light border rounded">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
                
                {this.state.errorInfo?.componentStack && (
                  <details className="mt-3">
                    <summary>Component Stack</summary>
                    <pre className="small mt-2 p-2 bg-light border rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </Alert>
              
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => window.location.href = '/admin/all-courses'}
                >
                  Back to Courses
                </Button>
                <Button 
                  variant="outline-success" 
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                >
                  Try Again
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;