import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

function Navbar() {

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
            <div className='flex justify-between items-center p-4  pb-14'>
                <div className='text-2xl font-bold'>Logo</div>
                <div className='flex gap-7'>
                <button 
                    onClick={() => handleButtonClick('standard')}
                    className={getButtonClasses(
                    'standard',
                    'bg-purple-400 text-black font-bold px-10 py-3 border-2 border-black shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-[1px_1px_0px_black] active:translate-x-1 active:translate-y-1 transition-all duration-100 rounded-3xl text-xl'
                    )}
                >
                     Home
                </button>
                <button 
                onClick={() => handleButtonClick('large')}
                className={getButtonClasses(
                'large',
                'bg-purple-400 text-black font-bold px-10 py-4 text-lg border-3 border-black shadow-[6px_6px_0px_black] hover:shadow-[3px_3px_0px_black] hover:translate-x-1 hover:translate-y-1 active:shadow-[1px_1px_0px_black] active:translate-x-2 active:translate-y-2 transition-all duration-100 rounded-3xl text-xl'
                )}>
                    FAQs
                    </button>

                </div>
                <div className='flex gap-4'>
                    <button className='text-white mr-6'>
                        <FontAwesomeIcon icon={faCircleUser} className="text-4xl md:text-4xl" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Navbar;