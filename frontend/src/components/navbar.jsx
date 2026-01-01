import {Link} from 'react-router-dom';

import React from 'react'

function Navbar({onLogout}) {
  return (
    <>
    <nav>
        <ul>
            <li><Link to="../Dashboard"> Dashboard</Link></li>
            <li><Link to="../createNote"> Create Notes</Link></li>
            <li><button onClick={onLogout}>Logout</button></li>
        </ul>
    </nav>
    </>
  )
}

export default Navbar;