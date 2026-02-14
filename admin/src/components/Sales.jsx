import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Sales = ({ token }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0
  })

  useEffect(() => {
    if (token) {
      // Fetch logic here. For now, using dummy data.
      // const fetchSales = async () => { ... }
      
      setStats({
        totalSales: 125000,
        totalOrders: 45,
        avgOrderValue: 2777
      })
    }
  }, [token])

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-6">Sales Overview</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Total Revenue</p>
          <p className="text-3xl font-bold text-[#D4AF37]">{currency} {stats.totalSales.toLocaleString()}</p>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Total Orders</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
        </div>

        {/* Card 3: Avg Order Value */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Avg Order Value</p>
          <p className="text-3xl font-bold text-gray-800">{currency} {stats.avgOrderValue.toLocaleString()}</p>
        </div>

      </div>

      {/* Placeholder for a Graph or Detailed Table */}
      <div className="bg-[#fdfbf7] border border-[#eee] rounded-lg p-10 flex flex-col items-center justify-center text-gray-400 h-64">
        <p>Sales Graph / Monthly Report Placeholder</p>
        <span className="text-xs mt-2">(Integrate Chart.js here for visual data)</span>
      </div>
    </div>
  )
}

export default Sales