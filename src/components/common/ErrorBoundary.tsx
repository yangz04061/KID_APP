import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
          <h2>Oops, something went wrong.</h2>
          <p>Please refresh the page to try again.</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16 }}>
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
