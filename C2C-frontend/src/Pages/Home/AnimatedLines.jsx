import React from 'react'

const AnimatedLines = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#1E1E1E] overflow-hidden">
      {/* Background Lines Container */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Background Line 1 */}
        <div 
          className="absolute border-2 border-blue-200/20 rounded-full animate-float-1"
          style={{
            width: '629px',
            height: '773px',
            top: '20%',
            right: '-200px'
          }}
        ></div>
        
        {/* Background Line 2 */}
        <div 
          className="absolute border-2 border-blue-200/20 rounded-full animate-float-2"
          style={{
            width: '1021px',
            height: '575px',
            top: '40%',
            right: '-300px'
          }}
        ></div>
        
        {/* Background Line 3 */}
        <div 
          className="absolute border-2 border-blue-200/20 rounded-full animate-float-3"
          style={{
            width: '800px',
            height: '600px',
            top: '70%',
            left: '-200px'
          }}
        ></div>
      </div>
      
      
      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes floatLine1 {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-50px) rotate(180deg); 
          }
        }
        
        @keyframes floatLine2 {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-50px) rotate(-180deg); 
          }
        }
        
        @keyframes floatLine3 {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-50px) rotate(180deg); 
          }
        }
        
        .animate-float-1 {
          animation: floatLine1 20s infinite ease-in-out;
          transition: transform 0.1s linear;
        }
        
        .animate-float-2 {
          animation: floatLine2 25s infinite ease-in-out;
          transition: transform 0.1s linear;
        }
        
        .animate-float-3 {
          animation: floatLine3 30s infinite ease-in-out;
          transition: transform 0.1s linear;
        }
      `}</style>
    </div>
  );
}

export default AnimatedLines