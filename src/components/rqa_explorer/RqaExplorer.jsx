import React, { useState, useEffect } from 'react'

import RqaTree from './Tree';
import RqaExplorerHeader from './Header';
import ResizeBar from '../ResizeBar';

export default function RqaExplorer() {

    // Resize States
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(300); // Initial width of the sidebar

    // Pressing the + pens an input field.
    const [inputOpen, setInputOpen] = useState(false);

    const handleAddClick = () => {
        setInputOpen(true);
    }

    return (
        <>
            <div className="py-4 px-4 prose overflow-scroll" style={{ width: `${sidebarWidth}px`, cursor: isResizing ? 'col-resize' : 'default', }}>
                <RqaExplorerHeader handleAddClick={handleAddClick} />
                <RqaTree inputOpen={inputOpen} setInputOpen={setInputOpen} />
            </div >
            <ResizeBar setSidebarWidth={setSidebarWidth} setIsResizing={setIsResizing} isResizing={isResizing} />
        </>
    )
}
