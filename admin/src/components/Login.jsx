import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.post('http://localhost:4000/api/user/admin', { email, password })
      if (response.data.success) {
        setToken(response.data.token)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-900 to-gray-800'>
      <div className='bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-xl px-10 py-12 max-w-md w-full'>
        <h1 className='text-3xl font-bold mb-2 text-white text-center tracking-wider'>ANB JEWELLERY</h1>
        <p className='text-gray-300 text-center mb-8 text-sm uppercase tracking-widest'>Admin Portal</p>
        
        <form onSubmit={onSubmitHandler}>
          <div className='mb-6'>
            <label className='block text-xs font-bold text-gray-300 mb-2 uppercase'>Email Address</label>
            <input onChange={(e) => setEmail(e.target.value)} value={email} 
              className='w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all' 
              type="email" placeholder='admin@anbjewl.com' required />
          </div>
          <div className='mb-8'>
            <label className='block text-xs font-bold text-gray-300 mb-2 uppercase'>Password</label>
            <input onChange={(e) => setPassword(e.target.value)} value={password} 
              className='w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all' 
              type="password" placeholder='••••••••' required />
          </div>
          <button className='w-full py-3 px-4 rounded-lg text-black font-bold bg-[#D4AF37] hover:bg-[#c5a028] transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-yellow-500/20' type="submit">
            LOGIN DASHBOARD
          </button>
        </form>
      </div>
    </div>
  )
}
export default Login