import { Dispatch, MutableRefObject, SetStateAction, useCallback } from 'react';
import { useOnViewportChange } from 'reactflow';

export function hideComponentOnViewportClick(ref: MutableRefObject<any>, setFunction: Dispatch<SetStateAction<boolean | undefined>>) {
	useOnViewportChange({
		onStart: useCallback((viewport: any) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setFunction((prevState) => !prevState)
			}
		}, []),
	});
	return null;
}