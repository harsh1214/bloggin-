import React from 'react';
import "../../styles/Loader.css";

export default function Loading() {
    return (
        <div className='relative min-h-100 overflow-hidden'>
            <div className="loader">
                <span><span></span><span></span><span></span><span></span></span>
                <div className="base">
                    <span></span>
                    <div className="face"></div>
                </div>
            </div>
            <div className="longfazers">
                <span></span><span></span><span></span><span></span>
            </div>
        </div>
    )
}
