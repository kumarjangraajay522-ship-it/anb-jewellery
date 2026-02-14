import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App' // Ensure this export exists in your App.jsx or config
import { toast } from 'react-toastify'

const Queries = ({ token }) => {
  const [queries, setQueries] = useState([])

  const fetchQueries = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/contact/list', { headers: { token } })
      if (response.data.success) {
        setQueries(response.data.queries.reverse()) // Show newest first
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Error fetching queries")
    }
  }

  useEffect(() => {
    if (token) {
      fetchQueries()
    }
  }, [token])

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Customer Queries</h3>
      <div className="flex flex-col gap-4">
        {queries.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_3fr_1fr] gap-4 items-start border p-4 bg-white shadow-sm rounded-lg text-sm">
            
            <div className="flex flex-col gap-1">
              <p className="font-bold text-gray-800">{item.name}</p>
              <p className="text-gray-500 text-xs">{item.email}</p>
              {/* Format Date */}
              <p className="text-gray-400 text-xs mt-1">{new Date(item.date).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-100">
              <p className="text-gray-600">{item.message}</p>
            </div>

            <a 
                href={`mailto:${item.email}?subject=Reply to your query - AnB Jewels`}
                className="bg-[#D4AF37] text-white px-3 py-1 rounded text-xs hover:bg-[#b5952f] transition-colors text-center flex items-center justify-center no-underline"
            >
              Reply via Email
            </a>

          </div>
        ))}
        {queries.length === 0 && <p className="text-gray-400 text-center mt-10">No queries found.</p>}
      </div>
    </div>
  )
}

export default Queries