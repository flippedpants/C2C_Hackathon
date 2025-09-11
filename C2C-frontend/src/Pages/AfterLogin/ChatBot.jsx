import React, { useState, useRef, useEffect } from 'react'
import { Nav2 } from '@/components/Nav2'
import { Send } from 'lucide-react'
import botLogo from '@/assets/bot-logo.png'
import { Button } from '@/components/Button'
//import { askStylistLLM } from 

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello, how can I assist you with your outfit today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTab, setSelectedTab] = useState('Upload Outfit')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    // Call backend stylist endpoint
    try {
      const { auth } = await import('@/config/firebase')
      const uid = auth.currentUser?.uid || 'guest'
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      const res = await fetch(`${baseUrl}/chat/stylist/ask/${uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentInput })
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        throw new Error(errText || `Request failed with ${res.status}`)
      }

      const data = await res.json()
      const answer = data?.answer || 'Sorry, I could not generate a response.'

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: answer,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsExpanded(true)
    } catch (error) {
      const botError = {
        id: Date.now() + 2,
        type: 'bot',
        content: 'There was an error contacting the stylist. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botError])
      console.error('Chat error:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  return (
    <>
      <div className="min-h-screen bg-[#1E1E1E]">
        <Nav2 />
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div 
            className="absolute border-2 border-[#BD6BE7]/80 rounded-full animate-float-1"
            style={{ width: '629px', height: '773px', top: '20%', right: '-200px' }}
          ></div>
          <div 
            className="absolute border-2 border-[#BD6BE7]/80 rounded-full animate-float-2"
            style={{ width: '1021px', height: '575px', top: '40%', right: '-300px' }}
          ></div>
          <div 
            className="absolute border-2 border-[#BD6BE7]/80 rounded-full animate-float-3"
            style={{ width: '800px', height: '600px', top: '70%', left: '-200px' }}
          ></div>
        </div>
        <div className="relative z-10 w-full flex justify-center pt-3 pb-10">
          <div className="flex items-center gap-4">
            <Button name="Upload Outfit" isSelected={selectedTab === 'Upload Outfit'} onClick={() => setSelectedTab('Upload Outfit')} />
            <Button name="Style-Chat" isSelected={selectedTab === 'Style-Chat'} onClick={() => setSelectedTab('Style-Chat')} />
            <Button name="My Wardrobe" isSelected={selectedTab === 'My Wardrobe'} onClick={() => setSelectedTab('My Wardrobe')} />
          </div>
        </div>
        <div className={`relative z-10 w-full max-w-4xl mx-auto ${isExpanded ? 'h-[68vh]' : 'h-[48vh]'} md:h-[68vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border-y-[24px] border-x-[16px] border-[#D8D2F0] transition-all duration-500`}>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((message) => (
              <div key={message.id} className="w-full">
                {message.type === 'bot' ? (
                  <div className="flex items-start space-x-4">
                    <img src={botLogo} alt="Bot" className="w-8 h-8 rounded-full flex-shrink-0 mt-1 object-contain" />
                    <div className="flex-1 bg-gray-50 rounded-3xl p-4 shadow-sm">
                      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl p-4 shadow-lg">
                      <div className="leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-4">
                <img src={botLogo} alt="Bot" className="w-8 h-8 rounded-full flex-shrink-0 mt-1 object-contain" />
                <div className="flex-1 bg-gray-50 rounded-3xl p-4 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-100">
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-3xl border-2 border-[#D8D2F0] shadow-lg overflow-hidden focus-within:border-black focus-within:ring-0 focus-within:ring-black">
                <div className="flex items-end p-2 space-x-2">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Start asking about outfit, colors and fashion tips...."
                    className="flex-1 resize-none bg-transparent text-gray-700 placeholder-gray-500 min-h-[16px] max-h-[80px] py-1.5 px-2 text-xs leading-relaxed border-none focus:border-none focus:ring-0 outline-none"
                    rows={1}
                  />

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || isTyping}
                    className="flex-shrink-0 p-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatBot;