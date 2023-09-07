import React from 'react'

export default function DropdownLeft({ rqas, loadtest }) {

    const addToRqaClick = (rqaId) => {
        console.log(rqaId)

    }

    return (
        <div className="dropdown dropdown-right">
            <label tabIndex={0} className="btn m-1">Add to Rqa {'>'}</label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {rqas?.map((rqa) => {
                    return <li key={rqa.id}><a className='no-underline' onClick={() => addToRqaClick(rqa.id)}>{rqa.name}</a></li>
                })

                }
            </ul>
        </div >
    )
}
