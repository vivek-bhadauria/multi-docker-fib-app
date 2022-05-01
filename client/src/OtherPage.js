import React from 'react';
import { Link } from 'react-router-dom';

const otherPage = () => {
    return (
        <div>
            In Some Other Page !!!
            <Link to="/">Home</Link>
        </div>

    );
};

export default otherPage;