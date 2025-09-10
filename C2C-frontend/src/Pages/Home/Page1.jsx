import React from 'react'
import NamePic from '@/assets/Name_pic.png'
import { Button } from '@/components/Button'

const Page1 = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#1E1E1E] overflow-hidden">

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div 
          className="absolute border-2 border-[#BD6BE7]/80 rounded-full animate-float-1"
          style={{
            width: '629px',
            height: '773px',
            top: '20%',
            right: '-200px'
          }}
        ></div>
        
        <div 
          className="absolute border-2 border-[#BD6BE7]/80 rounded-full animate-float-2"
          style={{
            width: '1021px',
            height: '575px',
            top: '40%',
            right: '-300px'
          }}
        ></div>

        <div 
          className="absolute border-2 border-[#BD6BE7]/80 rounded-full animate-float-3"
          style={{
            width: '800px',
            height: '600px',
            top: '70%',
            left: '-200px'
          }}
        ></div>
      </div>

      <div className="relative z-10">
        <div className=' h-[40vh] w-full stylio mb-[13vh]'>
          <div className="flex items-center pl-[7vw]">
            <img 
              src={NamePic}
              alt="Name"
              className="w-full h-auto max-w-[500px] md:max-w-[700px] lg:max-w-[900px]"
            />
          </div>
        </div>

        <div className='h-[60vh] pl-[8vw] '>

          <div className='Info-container w-fit'>
            <h1 className='text-white font-bold text-[7vh] md:text-balance font-poppins'>
              Reimagine your <span className="bg-purple-400/40 font-bold text-white/100 px-4 py-1 rounded-xl inline-block"> wardrobe </span> <br />
              with AI
            </h1>
            <h1 className='para font-poppins text-[4vh] text-[#C7C7C7] pt-8'> Turn your closet into a smart space with <br />intelligent outfit planning.</h1>

            <div className='flex justify-center text-center m-7 '>
              <Button name= "Start Now" />
          </div>
          </div>


        </div>
      </div>


    </div>
  )
}

export default Page1;