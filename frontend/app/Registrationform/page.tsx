'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { ConnectWallet } from '@/components/atoms/ConnectWallet'

const Page: React.FC = () => {
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const [showForm, setShowForm] = useState(true)
  const [role, setRole] = useState('')
  const [fullName, setFullName] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = {
      role,
      fullName,
      fileName: file?.name || '',
    }
    localStorage.setItem('registrationFormData', JSON.stringify(formData))
    setShowForm(false)
  }



  useEffect(() => {
    if (isConnected) {
      const storedData = localStorage.getItem('registrationFormData')
      if (storedData) {
        router.push('/Profile')
      }
    }
  }, [isConnected, router])

  return (
    <>
      <div
        className="flex flex-col items-center pt-40 pb-5 min-h-screen text-gray-800 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/city-background-panoramic-view.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 border border-gray-200 shadow-lg rounded-lg w-full max-w-[95vw]
        bg-opacity-95 bg-white sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-auto md:h-[700px] flex pt-6 flex-col">
          <div className="flex pt-6 items-center flex-col">
            <p className="text-3xl font-bold text-blue-700">User Registration</p>
            <p className='text-gray-500 text-xl mt-8 text-center'> Join as a Renter, Homeowner, or Both </p>
          </div>
          {showForm ? (
            <form onSubmit={handleSubmit} className="mt-12 w-full">
              <div className="px-4 sm:px-8 md:ml-4">
                <p className='font-bold text-gray-600'>Select your role</p>
                <label className="mr-4 mt-3">
                  <input
                    type='radio'
                    value='Renter'
                    name='role'
                    className='mr-2'
                    checked={role === 'Renter'}
                    onChange={() => setRole('Renter')}
                  />
                  Renter
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    value="Homeowner"
                    name="role"
                    className='mr-2'
                    checked={role === 'Homeowner'}
                    onChange={() => setRole('Homeowner')}
                  />
                  Homeowner
                </label>
                <label className="mr-4">
                  <input
                    type="radio"
                    value="Both"
                    name="role"
                    className='mr-2 '
                    checked={role === 'Both'}
                    onChange={() => setRole('Both')}
                  />
                  Both
                </label>
              </div>
              <div className='px-4 sm:px-8 md:ml-4 mt-0 font-bold text-gray-600'>
                <p className='pb-4 mt-5'>Profile Details</p>
                <div className="relative w-full max-w-full md:w-[700px] ">
                  <input
                    type="text"
                    className="block border py-4 px-6 focus:outline-none w-full max-w-full
                    md:w-[700px] bg-transparent outline-none rounded-lg border-gray-300 "
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                  <span className="absolute -top-3 left-4 bg-white bg-opacity-65 px-2 text-sm text-gray-400">
                    Full name
                  </span>
                </div>
              </div>
              <div className='px-4 sm:px-8 md:ml-4 mt-10'>
                <p className='font-bold text-gray-600'>Profile Upload (Upload to IPFS)</p>
                <input
                  type="file"
                  className='p-4 w-full max-w-full md:w-[700px] bg-transparent outline-none
                  border mt-3 rounded-lg border-gray-300'
                  onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                />
                <p className='mt-1 text-gray-400'>Supported formats: JPEG, PNG,  Max Size: 5MB</p>
              </div>
              <button
                type="submit"
                className='p-4 w-full max-w-full lg:w-[700px] sm:w-[500px] md:w-[620px] mt-3 rounded-lg md:ml-12
                ml-0 text-white text-xl bg-blue-700 font-bold'
              >
                Submit
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <ConnectWallet />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Page