'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { ConnectWallet } from '@/components/atoms/ConnectWallet'
import { useRegisterUser, useIsUserRegistered } from '@/lib/contracts/hooks'
import { UserRole } from '@/lib/contracts/types'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Page: React.FC = () => {
  const router = useRouter()
  const { isConnected, address, chainId } = useAccount()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()
  const [showForm, setShowForm] = useState(true)
  const [role, setRole] = useState('')
  const [fullName, setFullName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileCID, setFileCID] = useState<string | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Contract hooks
  const { data: isRegistered, isLoading: registrationCheckLoading } = useIsUserRegistered();
  const { 
    registerUser, 
    isPending: isRegistering, 
    isSuccess: registrationSuccess,
    error: registrationError 
  } = useRegisterUser();

  // Auto-switch to Sepolia if on wrong network
  useEffect(() => {
    if (isConnected && chainId && chainId !== sepolia.id) {
      console.log('🔄 Auto-switching to Sepolia network...')
      switchChain({ chainId: sepolia.id })
    }
  }, [isConnected, chainId, switchChain])

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const uploadFileToIPFS = async (file: File): Promise<string> => {
    console.log('🚀 Starting IPFS upload...')
    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    
    // Debug environment variables
    console.log('🔧 Environment variables:')
    console.log('API URL:', process.env.NEXT_PUBLIC_PINATA_API_URL)
    console.log('Gateway:', process.env.NEXT_PUBLIC_PINATA_GATEWAY)
    console.log('JWT exists:', !!process.env.NEXT_PUBLIC_PINATA_JWT)
    
    if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
      throw new Error('Pinata JWT token not found in environment variables')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', 'profile-upload')

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.NEXT_PUBLIC_PINATA_API_URL,
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      data: formData,
    }

    console.log('📤 Upload config:', {
      url: config.url,
      method: config.method,
      hasAuth: !!config.headers.Authorization
    })

    try {
      console.log('⏳ Sending request to Pinata...')
      const response = await axios.request(config)
      console.log('✅ File uploaded successfully!')
      console.log('📊 Response data:', response.data)
      console.log('🔗 IPFS Hash:', response.data.IpfsHash)
      console.log('🌐 Gateway URL:', `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/${response.data.IpfsHash}`)
      
      return response.data.IpfsHash
    } catch (error: any) {
      console.error('❌ Error uploading file:')
      console.error('Error object:', error)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Pinata API key. Please check your JWT token.')
      } else if (error.response?.status === 413) {
        throw new Error('File too large. Please use a smaller file.')
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      } else {
        throw new Error(`Upload failed: ${error.response?.data?.error || error.message}`)
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📝 File change event triggered')
    
    if (!e.target.files?.[0]) {
      console.log('❌ No file selected')
      return
    }

    const selectedFile = e.target.files[0]
    console.log('📁 Selected file:', {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: new Date(selectedFile.lastModified).toISOString()
    })

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setIsSubmitting(true)
    setFile(selectedFile)

    try {
      console.log('🖼️ Creating file preview...')
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Data = reader.result?.toString().split(',')[1]
        if (base64Data) {
          setFilePreview(base64Data)
          console.log('✅ File preview created')
        }
      }
      reader.readAsDataURL(selectedFile)

      console.log('☁️ Starting IPFS upload...')
      // Upload to IPFS
      const cid = await uploadFileToIPFS(selectedFile)
      setFileCID(cid)
      
      console.log('🎉 Upload completed successfully!')
      toast.success(`File uploaded successfully! CID: ${cid}`)
    } catch (error: any) {
      console.error('💥 Error in handleFileChange:', error)
      toast.error(`Upload failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
      console.log('🏁 File handling completed')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Check if wallet is connected first
    if (!isConnected) {
      toast.error('Please connect your wallet first!')
      return
    }
    
    if (!fileCID) {
      toast.error('Please upload a profile file first.')
      return
    }

    if (!role || !fullName) {
      toast.error('Please fill in all required fields.')
      return
    }

    // Convert role string to UserRole enum
    let userRole: UserRole;
    switch (role) {
      case 'Renter':
        userRole = 0;
        break;
      case 'Homeowner':
        userRole = 1;
        break;
      case 'Both':
        userRole = 1; // Default to Homeowner for "Both" case
        break;
      default:
        toast.error('Please select a valid role.')
        return;
    }

    // Create IPFS hash for profile data
    const profileHash = `ipfs://${fileCID}`;
    
    try {
      console.log('📝 Calling registerUser contract function...')
      console.log('Parameters:', {
        role: userRole,
        fullName,
        profileHash
      })
      
      // Call the smart contract - this will trigger MetaMask popup
      registerUser([userRole, fullName, profileHash]);
      
      toast.info('Please confirm the transaction in your MetaMask wallet.')
    } catch (error: any) {
      console.error('❌ Error calling registerUser:', error)
      toast.error(`Registration failed: ${error.message}`)
    }
  }

  // Handle registration success
  useEffect(() => {
    if (registrationSuccess) {
      toast.success('✅ User registered successfully on blockchain!')
      
      // Clear all form inputs
      setRole('')
      setFullName('')
      setFile(null)
      setFileCID(null)
      setFilePreview(null)
      setIsSubmitting(false)
      
      // Clear form data from localStorage
      localStorage.removeItem('registrationFormData')
      
      // Redirect to profile page after a short delay to show success message
      setTimeout(() => {
        router.push('/Profile')
      }, 1500)
    }
  }, [registrationSuccess, router])

  // Handle registration error
  useEffect(() => {
    if (registrationError) {
      console.error('❌ Registration error:', registrationError)
      toast.error(`Registration failed: ${registrationError.message}`)
    }
  }, [registrationError])

  // Check if user is already registered
  useEffect(() => {
    if (isMounted && isConnected && !registrationCheckLoading) {
      if (isRegistered) {
        toast.info('User is already registered!')
        router.push('/Profile')
      }
    }
  }, [isMounted, isConnected, isRegistered, registrationCheckLoading, router])

  // Don't render wallet-dependent content until mounted
  if (!isMounted) {
    return (
      <div
        className="flex flex-col items-center pt-20 pb-8 min-h-screen text-gray-800 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/city-background-panoramic-view.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 border border-gray-200 shadow-xl rounded-2xl w-full max-w-xl mx-auto
        bg-white/95 backdrop-blur-sm h-auto min-h-[600px] flex flex-col">
          <div className="flex pt-8 pb-6 items-center flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">User Registration</h1>
            <p className='text-gray-500 text-sm text-center px-4'>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div
        className="flex flex-col items-center pt-20 pb-8 min-h-screen text-gray-800 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/city-background-panoramic-view.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 border border-gray-200 shadow-xl rounded-2xl w-full max-w-xl mx-auto
        bg-white/95 backdrop-blur-sm h-auto min-h-[600px] flex flex-col">
          <div className="flex pt-8 pb-6 items-center flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">User Registration</h1>
            <p className='text-gray-500 text-sm text-center px-4'>Join as a Renter, Homeowner, or Both</p>
          </div>
          
          {/* Wallet Connection Status */}
          {!isConnected && (
            <div className="px-6 pb-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-yellow-800 font-medium">Wallet Not Connected</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">Please connect your wallet to continue with registration.</p>
              </div>
              <div className="flex justify-center">
                <ConnectWallet />
              </div>
            </div>
          )}

          {/* Network Warning */}
          {isConnected && chainId !== sepolia.id && (
            <div className="px-6 pb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-800 font-medium">
                    {isSwitchingChain ? 'Switching to Sepolia...' : 'Wrong Network'}
                  </span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  {isSwitchingChain 
                    ? 'Please confirm the network switch in your wallet.'
                    : 'Your wallet needs to be on Sepolia testnet for registration.'
                  }
                </p>
                {!isSwitchingChain && (
                  <button
                    onClick={() => switchChain({ chainId: sepolia.id })}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Switch to Sepolia
                  </button>
                )}
                {isSwitchingChain && (
                  <div className="flex items-center mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-blue-600 text-sm">Switching...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Registration Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="flex-1 px-6 pb-8">
              <div className="mb-6">
                <label className='block text-sm font-semibold text-gray-700 mb-3'>Select your role</label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type='radio'
                      value='Renter'
                      name='role'
                      className='mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                      checked={role === 'Renter'}
                      onChange={() => setRole('Renter')}
                    />
                    <span className="text-gray-700">Renter</span>
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      value="Homeowner"
                      name="role"
                      className='mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                      checked={role === 'Homeowner'}
                      onChange={() => setRole('Homeowner')}
                    />
                    <span className="text-gray-700">Homeowner</span>
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      value="Both"
                      name="role"
                      className='mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                      checked={role === 'Both'}
                      onChange={() => setRole('Both')}
                    />
                    <span className="text-gray-700">Both</span>
                  </label>
                </div>
              </div>
              
              <div className='mb-6'>
                <label className='block text-sm font-semibold text-gray-700 mb-3'>Profile Details</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className='mb-8'>
                <label className='block text-sm font-semibold text-gray-700 mb-3'>Profile Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    className='hidden'
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="file-upload" className={`cursor-pointer ${isSubmitting ? 'opacity-50' : ''}`}>
                    <div className="text-gray-500">
                      <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm">
                        {isSubmitting ? 'Uploading...' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">JPEG, PNG up to 5MB</p>
                    </div>
                  </label>
                </div>
                
                {filePreview && (
                  <div className="mt-4 text-center">
                    <img
                      src={`data:image/png;base64,${filePreview}`}
                      alt="Profile Preview"
                      className="mx-auto h-32 w-auto rounded-lg border"
                    />
                    {fileCID && (
                      <div className="mt-2">
                        <p className="text-xs text-green-600">✓ File uploaded to IPFS</p>
                        <a
                          href={`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/${fileCID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 underline hover:text-blue-700"
                        >
                          View on IPFS
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!isConnected || isRegistering || !fileCID || !role || !fullName || chainId !== sepolia.id}
                className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                {!isConnected ? 'Connect Wallet First' : 
                 chainId !== sepolia.id ? 'Switch to Sepolia First' :
                 isRegistering ? 'Confirming in MetaMask...' : 'Submit Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default Page