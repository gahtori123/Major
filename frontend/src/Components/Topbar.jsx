import React from 'react'

function Topbar() {
  return (
    <div className='w-full min-h-[8vh] flex items-center bg-gray-900'>
      <div className=' bg-gray-900 mr-3'>
        <img
          className='w-16 h-auto'
          src='https://as2.ftcdn.net/v2/jpg/05/97/83/11/1000_F_597831145_JnbPstuuRE7dYEm5hXjKdjmxFRv6ABla.jpg'
        />
      </div>
        <h1 className='text-white'>Batchit</h1>
    </div>
  )
}

export default Topbar
