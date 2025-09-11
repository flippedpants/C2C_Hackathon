import React, { useRef, useState } from 'react'
import { Nav2 } from '@/components/Nav2'
import { Button } from '@/components/Button'
import { useNavigate } from 'react-router-dom'
import Reffect from '@/assets/effect.png'
import Leffect from '@/assets/effect-left.png'
import BLeffect from '@/assets/effect-bleft.png'
import BReffect from '@/assets/effect-bright.png'

export const UploadOutfit = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('Upload Outfit')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [question, setQuestion] = useState('')
  const fileInputRef = useRef(null)

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const removeSelected = () => {
    setSelectedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl('')
  }

  const handleSend = async () => {
    if (!selectedFile) return
    
    try {
      // Get user ID
      const { auth } = await import('@/config/firebase')
      const uid = auth.currentUser?.uid || 'guest'
      
      // Prepare form data for the backend
      const formData = new FormData()
      formData.append('image', selectedFile)
      if (question.trim()) formData.append('question', question.trim())

      // Call the backend addGarmentWithImage endpoint
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      const response = await fetch(`${baseUrl}/chat/wardrobe/items/analyze/${uid}`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        throw new Error(errorText || `Request failed with ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        alert('Outfit analyzed and added to wardrobe successfully!')
        // Clear the form
        setSelectedFile(null)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl('')
        setQuestion('')
      } else {
        alert(`Error: ${result.error || 'Failed to analyze outfit'}`)
      }
    } catch (error) {
      console.error('Error uploading outfit:', error)
      alert('Failed to upload outfit. Please try again.')
    }
  }

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
            <Button name="Upload Outfit" isSelected={selectedTab === 'Upload Outfit'} onClick={async() => { setSelectedTab('Upload Outfit');
              try {
                const { auth } = await import('@/config/firebase')
                const uid = auth.currentUser?.uid || 'guest'
                navigate(`/chat/wardrobe/items/analyze/${uid}`)
              } catch {
                navigate('/chat/stylist/ask/guest')
              }
             }} />
            <Button name="Style-Chat" isSelected={selectedTab === 'Style-Chat'} onClick={async () => {
              setSelectedTab('Style-Chat')
              try {
                const { auth } = await import('@/config/firebase')
                const uid = auth.currentUser?.uid || 'guest'
                navigate(`/chat/stylist/ask/${uid}`)
              } catch {
                navigate('/chat/stylist/ask/guest')
              }
            }} />
            <Button name="My Wardrobe" isSelected={selectedTab === 'My Wardrobe'} onClick={() => { setSelectedTab('My Wardrobe'); navigate('/wardrobe') }} />
          </div>
        </div>

        <div className="relative w-full max-w-4xl mx-auto">
          <img
            src={Leffect}
            alt="corner effect"
            className="absolute z-20 pointer-events-none select-none object-contain transform scale-150"
            style={{ top: 'calc(-1vh - 24px)', left: 'calc(-2vh - 16px)', width: '48px', height: '48px' }}
          />
          <img
            src={Reffect}
            alt="corner effect"
            className="absolute z-20 pointer-events-none select-none object-contain transform scale-150"
            style={{ top: 'calc(-1vh - 24px)', right: 'calc(-2vh - 16px)', width: '48px', height: '48px' }}
          />
          <img
            src={BLeffect}
            alt="corner effect"
            className="absolute z-20 pointer-events-none select-none object-contain transform scale-150"
            style={{ bottom: 'calc(-1vh - 24px)', left: 'calc(-2vh - 16px)', width: '48px', height: '48px' }}
          />
          <img
            src={BReffect}
            alt="corner effect"
            className="absolute z-20 pointer-events-none select-none object-contain transform scale-150"
            style={{ bottom: 'calc(-1vh - 24px)', right: 'calc(-2vh - 16px)', width: '48px', height: '48px' }}
          />

          <div className={`chat-box relative z-10 w-full h-[68vh] md:h-[68vh] bg-[#D8D2F0] rounded-3xl shadow-2xl overflow-hidden flex flex-col border-y-[4vh] border-x-[3vh] border-[#9180D6] transition-all duration-500`}>
            <div className="inner-box flex h-full flex-col rounded-3xl bg-white border-2 border-[#D8D2F0] overflow-hidden">
              <div className="flex-1 p-6 md:p-8">
                <h2 className="text-2xl font-extrabold text-black mb-4">Upload Outfit</h2>

                <div className="w-full h-[32vh] bg-[#E9E1FB]/60 rounded-2xl border-2 border-dashed border-[#9180D6] flex items-center justify-center text-center mb-5 relative overflow-hidden">
                  {!previewUrl ? (
                    <div>
                      <div className="text-4xl md:text-5xl font-extrabold text-[#7D5BD6]">Stylio</div>
                      <div className="text-gray-700 mt-2">Click to upload an image</div>
                      <div className="text-gray-500 text-xs">or drag and drop here</div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-3">
                      <img src={previewUrl} alt="preview" className="max-h-full max-w-full object-contain rounded-xl" />
                      <button
                        type="button"
                        onClick={removeSelected}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center text-sm hover:bg-black/80"
                        aria-label="Remove image"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />

                {/* <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="What would you like to know about this image"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="flex-1 rounded-2xl border-2 border-dashed border-[#9180D6] bg-[#E9E1FB] placeholder-gray-600 px-4 py-3 outline-none"
                  /> */}
                  <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    disabled={!!selectedFile}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg hover:from-purple-600 hover:to-purple-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    + Add Item
                  </button>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={handleSend}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:from-blue-600 hover:to-purple-700 active:scale-[0.99]"
                    >
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
