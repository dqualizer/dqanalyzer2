import React from 'react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
export default function ExpandableRqaNode({ paramName, data, expandable = true, expandFunction, expanded, level, setInputOpen, setRqas }) {

    const [value, setValue] = useState(data);
    const [isEditing, setIsEditing] = useState(data ? false : true);
    const [domain, setDomain] = useState();
    const inputRef = useRef();

    const spacingVariants = {
        0: "px-0",
        1: "px-2",
        2: "px-4",
        3: "px-6",
        4: "px-8",
        5: "px-10",
        6: "px-16",
        8: "px-32",

    }


    const handleClick = () => {
        if (data && expandFunction)
            expandFunction((prevState) => !prevState)
    }

    const handleChangeValue = (e) => {
        setValue(e.target.value)
    }

    // Get Domain
    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`https://64917f002f2c7ee6c2c85311.mockapi.io/api/v1/domain/1`).then((response) => {
                setDomain(response.data);
            })
        }

        fetchData();

    }, []);


    const handleSave = async (event) => {

        if (event.key === 'Enter') {
            // Perform the desired action when "Enter" is pressed
            inputRef.current.blur(); // Unfocus the input field
            setIsEditing(false)
            await axios.post(`https://64917f002f2c7ee6c2c85311.mockapi.io/api/v1/rqas/`, {
                name: value,
                context: domain.context,
                environment: domain.server_info[0].environment,
                runtime_quality_analysis: {
                    loadtests: [],
                    resilience: [],
                    monitoring: []
                }
            }).then((response => {
                setInputOpen(false);
                setRqas(prevState => [...prevState, response.data]);
            }));


        }
    }

    const sendRqa = async () => {
        console.log()
    }


    return (
        <>
            <div className={`flex items-center hover:bg-slate-500 hover:cursor-pointer w-50 ${spacingVariants[level]} py-2 `} onClick={handleClick}>
                {!expandable ? null : expanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize='small' />}
                {level == 1 && isEditing ? <input ref={inputRef} type="text" autoFocus className="input input-bordered input-info w-full max-w-xs" onKeyDown={handleSave} onBlur={handleSave} onChange={handleChangeValue} value={value} /> : <span>{paramName && <b>{paramName}:</b>} {value}</span>}
                {level == 1 && <div className='hover:bg-slate-200' onClick={sendRqa}><PlayArrowIcon /></div>}
            </div>

        </>
    )
}
