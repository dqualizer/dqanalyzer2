import React from 'react'
import { all_icons } from '../../language/icon/all_Icons'

export default function Icon({ className, name }) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: all_icons[name] }} />
}
