import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
// import { Button } from '@/components/Button';
import logo from '@/assets/Main-logo.png'

export const Nav2 = () => {
  return (
    <>
        <div className='flex justify-end items-center p-4 pb-14'>
            <div className='pl-6 pt-1'>
            <img src={logo} alt="" className="w-20 h-auto" />
            </div>
            
            <div className='flex gap-4'>
                <button 
                onClick={onLoginClick}
                className='text-white mr-6 hover:text-gray-300 transition-colors'
                >
                    <FontAwesomeIcon icon={faCircleUser} className="text-4xl md:text-4xl" />
                </button>
            </div>
        </div>
    </>
  )
}