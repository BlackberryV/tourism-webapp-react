import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom"
import {AuthProvider} from "./firebase/AuthProvider";
import './styles/style.css'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement)

root.render(
    <AuthProvider>
        <Router>
            <App/>
        </Router>
    </AuthProvider>
)


