import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from '@/Pages/Home/Landing'
import ChatBot from '@/Pages/AfterLogin/ChatBot'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chat/stylist/ask/:uid" element={<ChatBot />} />
    </Routes>
  )
}

export default App


