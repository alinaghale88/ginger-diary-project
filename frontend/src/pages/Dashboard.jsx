import React from 'react'
import { CiSquarePlus } from "react-icons/ci";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <Link to={"/journal"}><CiSquarePlus className='text-[40px]' /></Link>
    </div>
  )
}

export default Dashboard