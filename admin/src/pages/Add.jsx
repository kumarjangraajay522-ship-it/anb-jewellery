import React from 'react'
import Add from '../components/Add'

const AddPage = ({ token }) => {
  console.log("AddPage is rendering, token:", token) // Debug line
  
  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <Add token={token} />
    </div>
  )
}

export default AddPage