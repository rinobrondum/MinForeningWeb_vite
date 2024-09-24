import { ErrorBoundary } from "react-error-boundary";

function Fallback({ error, resetErrorBoundary }) {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.
  
    return (
      <div role="alert" style={{ margin: "10px"}}>
        <p>We are sorry, something went wrong:</p>
        <pre style={{ color: "red" }}>{error.message}</pre>
        <br /><br />
        <a href="#" onClick={() => {
            window.location.reload();
        }}>Tryk her for at genstarte siden</a>
        <br /><br/>
        <span>Kontakt information i tilfælde af fejl: kontakt@minforening.dk</span>
      </div>
    );
  }

export default function ReactErrorBoundary(props) {
    return (
        <ErrorBoundary
            FallbackComponent={Fallback}
            onError={(error, errorInfo) => {
                // log the error
				console.log("Error caught!");  
				console.error(error);  
				console.error(errorInfo);
            }}
            onReset={() => {
                // reloading the page to restore the initial state
                // of the current page
                console.log("reloading the page...");
                window.location.reload();

                // other reset logic...
            }}
        >
            {props.children}
        </ErrorBoundary>
    );
}