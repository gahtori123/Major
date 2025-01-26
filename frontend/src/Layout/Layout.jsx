import React from 'react'

function Layout({children}) {
  return (
    <div className='flex'>
      <main className='flex-grow'>{children}</main>
    </div>
  )
}

export default Layout

