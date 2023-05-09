import React from 'react'
import { Panel } from 'reactflow'
import Archive from '../assets/archive.png'
import Unarchive from '../assets/unarchive.png'
import Forward from '../assets/forward.png'
import Gear from '../assets/gear.png'
import Image from '../assets/image.png'
import Play from '../assets/play.png'
import Previous from '../assets/previous.png'
import Spellcheck from '../assets/spellcheck.png'
import Keyboard from '../assets/keyboard.png'
import '../language/icon/icons.css'

export default function Taskbar() {
  return (
    <Panel position="top left">
      <div className='taskbar-container'>
        <button><div className="icon-domain-story-loadtest"></div></button>
        <button><div className="icon-domain-story-monitoring"></div></button>
        <button><div className="icon-domain-story-chaosexperiment"></div></button>
      </div>


    </Panel>

  )
}
