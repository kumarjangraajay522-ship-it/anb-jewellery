import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Updates = ({ token }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      // REPLACE with your actual API endpoint
      const response = await axios.post(backendUrl + '/api/news/add', { title, content }, { headers: { token } })
      
      if (response.data.success) {
        toast.success("Update Posted Successfully")
        setTitle('')
        setContent('')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to post update")
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <h3 className="text-xl font-bold mb-2">Post News & Updates</h3>

      <div className="w-full max-w-[500px]">
        <p className="mb-2 text-sm font-medium">Update Title</p>
        <input 
          onChange={(e) => setTitle(e.target.value)} 
          value={title} 
          className="w-full px-3 py-2 border border-gray-300 rounded outline-[#D4AF37]" 
          type="text" 
          placeholder="e.g. Summer Sale Started!" 
          required 
        />
      </div>

      <div className="w-full max-w-[500px]">
        <p className="mb-2 text-sm font-medium">Content / Message</p>
        <textarea 
          onChange={(e) => setContent(e.target.value)} 
          value={content} 
          className="w-full px-3 py-2 border border-gray-300 rounded outline-[#D4AF37] h-32 resize-none" 
          placeholder="Write your update details here..." 
          required 
        />
      </div>

      <button type="submit" className="w-40 mt-4 bg-black text-white py-3 rounded hover:bg-gray-800 active:bg-gray-700">
        POST UPDATE
      </button>
    </form>
  )
}

export default Updates