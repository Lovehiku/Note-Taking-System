import { Link } from 'react-router-dom'
import React from 'react'

function NoteCard() {
  return (
    <div className='note-card'>
        <h3>{note.title}</h3>
        <p>{note.content.substring(0, 50)}...</p>
        <Link to={`/notes/${note.id}`}>View</Link>
    </div>
  )
}

export default NoteCard