import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
// import { Button } from '@/components/Button';
import logo from '@/assets/Main-logo.png'
import logo2 from '@/assets/2nd-logo.png'

export const Nav2 = () => {
  return (
    <>
        <div className='flex justify-between items-center p-4 pb-14'>
        <div className=' h-[10vh] w-full '>
                <div className="flex items-center h-16 pl-4">
                    <img 
                        src={logo2}
                        alt="Logo"
                        className="h-full w-auto max-h-18 object-contain pt-5"
                        style={{ maxWidth: '200px' }}
                    />
                    <div className="ml-auto flex items-center">
                        <button 
                            // onClick={onLoginClick}
                            className='text-white ml-6 hover:text-gray-300 transition-colors pr-5'
                        >
                            <FontAwesomeIcon icon={faCircleUser} className="text-4xl md:text-4xl" />
                        </button>
                    </div>
                </div>
            
            </div>
        </div>
    </>
  )
}