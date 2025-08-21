'use client'
import React, { useState, useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useUserProfile, useUpdateProfile, useUpdateUserRole } from '@/lib/contracts/hooks'
import { UserRole } from '@/lib/contracts/types'
import { ConnectWallet } from '@/components/atoms/ConnectWallet'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProfilePage = () => {
  const { isConnected, address, chainId } = useAccount()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()
  const [isMounted, setIsMounted] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>(0)
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileCID, setFileCID] = useState<string | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  // Contract hooks
  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile, error: profileError } = useUserProfile(address);
  const { 
    updateProfile, 
    isPending: isUpdatingProfile, 
    isSuccess: profileUpdateSuccess,
    error: profileUpdateError 
  } = useUpdateProfile();
  const { 
    updateUserRole, 
    isPending: isUpdatingRole, 
    isSuccess: roleUpdateSuccess,
    error: roleUpdateError 
  } = useUpdateUserRole();

  // Debug logging
  useEffect(() => {
    console.log('🔍 Profile Debug Info:')
    console.log('Address:', address)
    console.log('Chain ID:', chainId)
    console.log('Is Connected:', isConnected)
    console.log('Profile Loading:', profileLoading)
    console.log('Profile Data:', userProfile)
    console.log('Profile Error:', profileError)
    console.log('Profile Hash from localStorage:', localStorage.getItem('registrationFormData'))
  }, [address, chainId, isConnected, profileLoading, userProfile, profileError])

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
    console.log('🚀 Starting IPFS upload for profile update...')
    
    if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
      throw new Error('Pinata JWT token not found in environment variables')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', 'profile-update')

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.NEXT_PUBLIC_PINATA_API_URL,
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      data: formData,
    }

    try {
      const response = await axios.request(config)
      console.log('✅ Profile image uploaded successfully!')
      return response.data.IpfsHash
    } catch (error: any) {
      console.error('❌ Error uploading profile image:', error)
      throw new Error(`Upload failed: ${error.response?.data?.error || error.message}`)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    const selectedFile = e.target.files[0]

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
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Data = reader.result?.toString().split(',')[1]
        if (base64Data) {
          setFilePreview(base64Data)
        }
      }
      reader.readAsDataURL(selectedFile)

      // Upload to IPFS
      const cid = await uploadFileToIPFS(selectedFile)
      setFileCID(cid)
      
      toast.success('Profile image uploaded successfully!')
    } catch (error: any) {
      console.error('💥 Error in handleFileChange:', error)
      toast.error(`Upload failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!fileCID) {
      toast.error('Please upload a profile image first.')
      return
    }

    try {
      const profileHash = `ipfs://${fileCID}`;
      console.log('📝 Calling updateProfile contract function...')
      console.log('Profile Hash:', profileHash)
      
      updateProfile([profileHash]);
      toast.info('Please confirm the profile update in your MetaMask wallet.')
    } catch (error: any) {
      console.error('❌ Error calling updateProfile:', error)
      toast.error(`Profile update failed: ${error.message}`)
    }
  }

  const handleUpdateRole = async () => {
    try {
      console.log('📝 Calling updateUserRole contract function...')
      console.log('New Role:', selectedRole)
      
      updateUserRole([selectedRole]);
      toast.info('Please confirm the role update in your MetaMask wallet.')
    } catch (error: any) {
      console.error('❌ Error calling updateUserRole:', error)
      toast.error(`Role update failed: ${error.message}`)
    }
  }

  // Handle profile update success
  useEffect(() => {
    if (profileUpdateSuccess) {
      toast.success('✅ Profile updated successfully on blockchain!')
      setShowEditForm(false)
      setFile(null)
      setFileCID(null)
      setFilePreview(null)
      refetchProfile() // Refresh profile data
    }
  }, [profileUpdateSuccess, refetchProfile])

  // Handle role update success
  useEffect(() => {
    if (roleUpdateSuccess) {
      toast.success('✅ Role updated successfully on blockchain!')
      refetchProfile() // Refresh profile data
    }
  }, [roleUpdateSuccess, refetchProfile])

  // Handle profile update error
  useEffect(() => {
    if (profileUpdateError) {
      console.error('❌ Profile update error:', profileUpdateError)
      toast.error(`Profile update failed: ${profileUpdateError.message}`)
    }
  }, [profileUpdateError])

  // Handle role update error
  useEffect(() => {
    if (roleUpdateError) {
      console.error('❌ Role update error:', roleUpdateError)
      toast.error(`Role update failed: ${roleUpdateError.message}`)
    }
  }, [roleUpdateError])

  // Don't render wallet-dependent content until mounted
  if (!isMounted) {
    return (
      <div className="bg-white min-h-screen w-full">
        <div className="bg-white min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-26 text-gray-900">
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <h2 className='text-2xl sm:text-3xl font-bold text-blue-900'>Profile</h2>
            </div>
            <p className='text-gray-500 text-base sm:text-lg mt-4'>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="bg-white min-h-screen w-full">
        <div className="bg-white min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-26 text-gray-900">
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <h2 className='text-2xl sm:text-3xl font-bold text-blue-900'>Profile</h2>
            </div>
            <div className="mt-8 text-center">
              <p className='text-gray-500 text-base sm:text-lg mb-4'>Please connect your wallet to view your profile</p>
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show network warning if on wrong network
  if (isConnected && chainId !== sepolia.id) {
    return (
      <div className="bg-white min-h-screen w-full">
        <div className="bg-white min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-26 text-gray-900">
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <h2 className='text-2xl sm:text-3xl font-bold text-blue-900'>Profile</h2>
            </div>
            <div className="mt-8 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  {isSwitchingChain ? 'Switching to Sepolia...' : 'Switching Network'}
                </h3>
                <p className='text-blue-700 mb-4'>
                  {isSwitchingChain 
                    ? 'Please confirm the network switch in your wallet to view your profile.'
                    : 'Your wallet needs to be on Sepolia testnet to view your profile.'
                  }
                </p>
                {!isSwitchingChain && (
                  <button
                    onClick={() => switchChain({ chainId: sepolia.id })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Switch to Sepolia
                  </button>
                )}
                {isSwitchingChain && (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-blue-600">Switching...</span>
                  </div>
                )}
              </div>
            </div>
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
      <div className="bg-white min-h-screen w-full">
        <div className="bg-white min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-26 text-gray-900">
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <h2 className='text-2xl sm:text-3xl font-bold text-blue-600'> User Profile</h2>
            </div>

            {profileLoading ? (
              <div className="mt-8 text-center">
                <p className='text-gray-500 text-base sm:text-lg'>Loading profile...</p>
              </div>
            ) : userProfile ? (
              <>
                <div className='flex flex-col md:flex-row items-center gap-6 md:gap-10 mt-8'>
                  {/* Profile Image */}
                  <div className="relative">
                    {filePreview ? (
                      <img 
                        src={`data:image/png;base64,${filePreview}`} 
                        alt="Profile Preview" 
                        className='w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mt-4 md:mt-10 rounded-full object-cover border-4 border-gray-200'
                      />
                    ) : userProfile.profileHash ? (
                      <img 
                        src={`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/${userProfile.profileHash.replace('ipfs://', '')}`} 
                        alt="Profile" 
                        className='w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mt-4 md:mt-10 rounded-full object-cover border-4 border-gray-200'
                        onError={(e) => {
                          e.currentTarget.src = "/3d-rendering-house-model.jpg"
                        }}
                      />
                    ) : (
                      <img 
                        src="/3d-rendering-house-model.jpg" 
                        alt="Default Profile" 
                        className='w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mt-4 md:mt-10 rounded-full object-cover border-4 border-gray-200'
                      />
                    )}
                    
                    {/* Edit Profile Image Button */}
                    {showEditForm && (
                      <div className="absolute bottom-0 right-0">
                        <label className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className='lg:mt-2 text-center md:text-left'>
                    <p className='text-2xl sm:text-3xl font-bold mt-2 md:mt-4'>{userProfile.fullName}</p>
                    <p className='text-gray-500 text-base sm:text-lg'>
                      {['Renter', 'Homeowner', 'Agent'][userProfile.role]}
                    </p>
                    <p className='text-gray-500 text-base sm:text-lg break-all'>
                      Address: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                    <p className='text-gray-500 text-base sm:text-lg'>
                      Reputation Score: {userProfile.reputationScore.toString()}
                    </p>
                    <p className='text-gray-500 text-base sm:text-lg'>
                      Total Transactions: {userProfile.totalTransactions.toString()}
                    </p>

                    {/* Edit Role Section */}
                    {showEditForm && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Update Role</h3>
                        <div className="flex gap-2 mb-3">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value={0}
                              checked={selectedRole === 0}
                              onChange={(e) => setSelectedRole(Number(e.target.value) as UserRole)}
                              className="mr-2"
                            />
                            Renter
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value={1}
                              checked={selectedRole === 1}
                              onChange={(e) => setSelectedRole(Number(e.target.value) as UserRole)}
                              className="mr-2"
                            />
                            Homeowner
                          </label>
                        </div>
                        <button
                          onClick={handleUpdateRole}
                          disabled={isUpdatingRole || selectedRole === userProfile.role}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        >
                          {isUpdatingRole ? 'Updating Role...' : 'Update Role'}
                        </button>
                      </div>
                    )}

                    {/* Update Profile Button */}
                    {showEditForm && fileCID && (
                      <div className="mt-4">
                        <button
                          onClick={handleUpdateProfile}
                          disabled={isUpdatingProfile}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                        >
                          {isUpdatingProfile ? 'Updating Profile...' : 'Update Profile Image'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Button - Centered below profile details */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowEditForm(!showEditForm)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {showEditForm ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-8 text-center">
                <p className='text-gray-500 text-base sm:text-lg'>No profile found. Please register first.</p>
              </div>
            )}

            <hr className='border-1 mt-10 md:mt-20 border-gray-300'/>

            <div className="">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-10 mt-5">
                <p className='text-gray-600 hover:text-blue-600 cursor-pointer'>Properties</p>
                <p className='text-gray-600 hover:text-blue-600 cursor-pointer'>Listings</p>
                <p className='text-gray-600 hover:text-blue-600 cursor-pointer'>Messages</p>
                <p className='text-gray-600 hover:text-blue-600 cursor-pointer'>Wallet</p>
                <p className='text-gray-600 hover:text-blue-600 cursor-pointer'>Settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage