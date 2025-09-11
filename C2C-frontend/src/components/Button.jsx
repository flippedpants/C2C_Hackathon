import React from 'react'

export const Button = ({ name, isSelected = false, onClick }) => {

  const baseClasses = 'bg-[#9180D6] text-black font-bold px-10 py-3 border-2 border-black shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-[1px_1px_0px_black] active:translate-x-1 active:translate-y-1 transition-all duration-100 rounded-3xl text-xl font-poppins'
  const visualState = isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-90'

  return (  
    <>
      <button 
        onClick={onClick}
        className={`${baseClasses} ${visualState}`}
      >
        {name}
      </button>
    </>
  )
}
