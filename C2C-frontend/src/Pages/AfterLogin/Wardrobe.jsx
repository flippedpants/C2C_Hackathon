import React, { useState } from 'react'
import { Nav2 } from '@/components/Nav2'
import { Button } from '@/components/Button'
import { useNavigate } from 'react-router-dom'
import Reffect from '@/assets/effect.png'
import Leffect from '@/assets/effect-left.png'
import BLeffect from '@/assets/effect-bleft.png'
import BReffect from '@/assets/effect-bright.png'
import shirtImg from '@/assets/shirt.png'
import jeansImg from '@/assets/jeans.png'
import shoesImg from '@/assets/shoes.png'
import watchImg from '@/assets/watch.png'
// 

const Wardrobe = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('My Wardrobe')
  const [selectedCategory, setSelectedCategory] = useState(null)

  const categories = [
    {
      id: 'topwear',
      name: 'Topwear',
      image: shirtImg,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'bottomwear', 
      name: 'Bottomwear',
      image: jeansImg,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'footwear',
      name: 'Footwear', 
      image: shoesImg,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      image: watchImg,
      color: 'from-purple-400 to-purple-600'
    }
  ]

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    // Here you can add logic to filter wardrobe items by category
    console.log('Selected category:', category.name)
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
            <Button name="Upload Outfit" isSelected={selectedTab === 'Upload Outfit'} onClick={async () => { 
              setSelectedTab('Upload Outfit');
              try {
                const { auth } = await import('@/config/firebase')
                const uid = auth.currentUser?.uid || 'guest'
                navigate(`/chat/wardrobe/items/analyze/${uid}`)
              } catch {
                navigate('/chat/wardrobe/items/analyze/guest')
              }
            }} />
            <Button name="Style-Chat" isSelected={selectedTab === 'Style-Chat'} onClick={async () => { 
              setSelectedTab('Style-Chat'); 
              try {
                const { auth } = await import('@/config/firebase')
                const uid = auth.currentUser?.uid || 'guest'
                navigate(`/chat/stylist/ask/${uid}`)
              } catch {
                navigate('/chat/stylist/ask/guest')
              }
            }} />
            <Button name="My Wardrobe" isSelected={selectedTab === 'My Wardrobe'} onClick={() => { 
              setSelectedTab('My Wardrobe'); 
              navigate('/wardrobe') 
            }} />
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

          <div className="chat-box relative z-10 w-full h-[68vh] md:h-[68vh] bg-[#D8D2F0] rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500">
            <div className="inner-box flex h-full flex-col rounded-3xl bg-white overflow-hidden">
              <div className="flex-1 p-6 md:p-8">
                <h2 className="text-2xl font-extrabold text-black mb-6">My Wardrobe</h2>
                
                {/* Category Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {categories.map((category) => {
                    return (
                      <div
                        key={category.id}
                        onClick={() => handleCategoryClick(category)}
                        className={`relative bg-gradient-to-br ${category.color} rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                          selectedCategory?.id === category.id ? 'ring-4 ring-purple-300 scale-105' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center justify-between h-32 p-2">
                          <div className="flex-1 flex items-center justify-center">
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="w-16 h-16 object-contain bg-transparent"
                            />
                          </div>
                          <span className="text-white font-semibold text-lg">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Selected Category Display */}
                {selectedCategory && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Selected: {selectedCategory.name}
                    </h3>
                    <p className="text-gray-600">
                      Here you can view and manage your {selectedCategory.name.toLowerCase()} items.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Wardrobe
