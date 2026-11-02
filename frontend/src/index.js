import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {domain && clientId ? (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{ redirect_uri: window.location.origin }}
      >
        <App />
      </Auth0Provider>
    ) : (
      <main style={{ maxWidth: 640, margin: "4rem auto", padding: "0 1rem" }}>
        <h1>Auth0 setup required</h1>
        <p>
          Sign-in is not configured. Add REACT_APP_AUTH0_DOMAIN and
          REACT_APP_AUTH0_CLIENT_ID to frontend/.env.local, then restart the
          frontend development server.
        </p>
        <p>
          In Auth0, allow http://localhost:3000 in the application's Callback
          URLs, Logout URLs, and Web Origins.
        </p>
      </main>
    )}
  </React.StrictMode>
);

// Measure performance in your app
reportWebVitals();
