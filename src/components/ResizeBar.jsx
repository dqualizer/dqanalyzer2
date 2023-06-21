import React, { useState, useEffect } from 'react'

export default function ResizeBar({ setSidebarWidth, setIsResizing, isResizing }) {

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    const handleMouseMove = (event) => {
        if (isResizing) {
            const newWidth = event.clientX;
            setSidebarWidth(newWidth);
        }
    };
    useEffect(() => {

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div className='hover:cursor-col-resize'
            style={{
                width: '5px',
                height: '100%',
                // backgroundColor: isResizing ? 'red' : 'transparent', // Change the color of the border when resizing
                // cursor: isResizing ? 'col-resize' : 'default',
            }}
            onMouseDown={handleMouseDown}
        />

    )
}
