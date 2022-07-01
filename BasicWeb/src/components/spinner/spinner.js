import React from 'react';
import './spinner.css'

export default () => {
    return <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
};