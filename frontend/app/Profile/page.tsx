import React from 'react'

const page = () => {
  return (
      <>    
          <div className=" bg-white min-h-screen w-full">
            <div className="bg-white min-h-screen  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  ">

              <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-26 text-gray-900">
                  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <h2 className='text-2xl sm:text-3xl font-bold text-blue-900'>Profile</h2>
                  </div>

                  <div className='flex flex-col md:flex-row items-center gap-6 md:gap-10 mt-8'>
                      <img src="/3d-rendering-house-model.jpg" alt="" className='w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mt-4 md:mt-10 rounded-full object-cover' />
                      <div className='lg:mt-2 text-center md:text-left'>
                          <p className='text-2xl sm:text-3xl font-bold mt-2 md:mt-4'>John Doe</p>
                          <p className='text-gray-500 text-base sm:text-lg'>Renter</p>
                          <p className='text-gray-500 text-base sm:text-lg break-all'>Email: robertsjohn@hmail.com</p>

                          <div className='text-gray-500 text-base sm:text-lg mt-2'>
                              <p>I'm into real estate buying and selling, renting and swapping</p>
                              <div>
                                  <button className='p-1 bg-white w-20 text-gray-900 border hover:text-blue-600 border-gray-400 font-bold rounded-lg mt-2'>Follow</button>
                              </div>
                          </div>
                      </div>
                  </div>
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

export default page