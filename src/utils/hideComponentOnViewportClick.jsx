import { useCallback } from 'react';
import ReactFlow, { useOnViewportChange } from 'reactflow';

export default function hideComponentOnViewportClick(ref, setFunction) {
    useOnViewportChange({
        onStart: useCallback((viewport) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setFunction((prevState) => !prevState)
            }
        }, []),
    });

    return null;
}