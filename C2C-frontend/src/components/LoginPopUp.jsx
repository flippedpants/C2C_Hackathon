import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { signInWithGoogle, ensureWardrobeDocument } from '@/config/firebase'
import { useNavigate } from 'react-router-dom'

export const LoginPopUp = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true); // Show loading state
    
    try {
      // 🔥 Call Firebase Google Sign-In
      const user = await signInWithGoogle();
      await ensureWardrobeDocument(user);
      navigate('/chat');
      
      // ✅ Success - Show welcome message
      alert(`Welcome ${user.displayName}! 🎉`);
      console.log('User logged in:', user);
      
      // 🚪 Close popup after successful login
      onClose();
      
    } catch (error) {
      // ❌ Handle errors gracefully
      console.error('Login failed:', error);
      
      // Show user-friendly error message
      if (error.code === 'auth/popup-closed-by-user') {
        alert('Login cancelled. Please try again if you want to sign in.');
      } else if (error.code === 'auth/network-request-failed') {
        alert('Network request failed. Ensure third-party cookies are enabled and no ad-blockers are blocking Google. Also verify authorized domains in Firebase.');
      } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
        alert('This environment does not support popup sign-in. Try in a regular browser window (not embedded or Incognito with strict blockers).');
      } else if (error.code === 'auth/invalid-api-key' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-auth-domain') {
        alert(`Firebase configuration error: ${error.code}. Check your VITE_ Firebase env vars and authorized domains.`);
      } else {
        alert(`Login failed: ${error.code || ''} ${error.message || ''}`.trim());
      }
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

    
  
  return (
    <>  
{isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          ></div>

          <div className="relative bg-[#D8D2F0] border-2 border-black rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 overflow-hidden">
            

            <div className="bg-[#9180D6] text-center py-4  border-b-2 border-black">
              <h1 className="text-black font-bold text-xl font-poppins">LOGIN</h1>
            </div>
            
           
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 transition-colors"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-black" />
            </button>

            
            <div className="text-center p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-black">Your wardrobe, upgraded with AI</h2>
                <p className="text-black mt-2 text-xl">Sign in to get started !!</p>
              </div>

              
              <div className="flex justify-center">
                <button 
                  onClick={handleGoogleLogin}
                  className="bg-white text-black font-bold px-10 py-3 border-2 border-black shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-[1px_1px_0px_black] active:translate-x-1 active:translate-y-1 transition-all duration-100 rounded-3xl text-xl font-poppins flex items-center gap-3"
                >
                  
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Login with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
