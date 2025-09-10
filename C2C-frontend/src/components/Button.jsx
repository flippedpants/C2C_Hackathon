import React, { useState } from 'react'

export const Button = ({ name }) => {

    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonClick = (buttonId) => {
      setSelectedButton(buttonId);
    };
  
    const getButtonClasses = (buttonId, baseClasses) => {
      const isSelected = selectedButton === buttonId;
      const opacityClasses = isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-90';
      return `${baseClasses} ${opacityClasses}`;
    };

  return (  
    <>
        <button 
            onClick={() => handleButtonClick('standard')}
            className={getButtonClasses(
            'standard',
            'bg-[#9180D6] text-black font-bold px-10 py-3 border-2 border-black shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-[1px_1px_0px_black] active:translate-x-1 active:translate-y-1 transition-all duration-100 rounded-3xl text-xl font-poppins'
            )}
        >
            {name}
        </button>
    </>
  )
}
