import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='navbar'>
            <Link to={"/"}>Dashboard</Link>
            <Link to={"/"}>Search</Link>
            <Link to={"/"}>New Chapter</Link>
            <Link to={"/"}>Gallery</Link>
            <Link to={"/"}>Export</Link>
            <Link to={"/"}>Profile</Link>
        </div>
    )
}

export default Navbar