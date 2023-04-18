import './style.css'
import ReactDOM from 'react-dom/client'
import React from 'react';
import { Context } from './Context';
import App from './App';

const root = ReactDOM.createRoot(document.querySelector('#root'))


root.render(
    <Context>
        <App />
    </Context>
)