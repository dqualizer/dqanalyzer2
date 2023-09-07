import React from 'react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState, useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRqa } from '../../queries/rqa';
import axios from 'axios';
export default function ExpandableRqaNode({ paramName, data, expandable = true, expandFunction, expanded, level, setInputOpen, setRqas }) {

    const [value, setValue] = useState(data);
    const [isEditing, setIsEditing] = useState(data ? false : true);
    const [domain, setDomain] = useState();
    const inputRef = useRef();
    const queryClient = useQueryClient();

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
    const fetchDomain = async () => {
        await axios.get(`https://64917f002f2c7ee6c2c85311.mockapi.io/api/v1/domain/1`).then((response) => {
            setDomain(response.data);
        })
    }

    // Get Domain
    useEffect(() => {
        if (isEditing) {
            fetchDomain();
        }
    }, []);

    const rqaMutation = useMutation({
        useMutation: ["rqas"],
        mutationFn: createRqa,
        onSuccess: data => {
            //queryClient.setQueryData(["rqas", data.id], data);
            queryClient.invalidateQueries(["rqas"]);
        }
    })


    const handleSave = async (event) => {

        if (event.key === 'Enter') {
            inputRef.current.blur(); // Unfocus the input field
            setIsEditing(false);
            rqaMutation.mutate({ name: value, environment: "DEV" });
        }
    }

    const sendRqa = async () => {
        console.log()
    }

    console.log(data)


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
