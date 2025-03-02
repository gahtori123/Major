import React from 'react'
import Sidebar from '../Components/Sidebar'
import Topbar from '../Components/Topbar'
import ChatList from '../Components/ChatList.jsx'
import ChatContainer from '../Components/ChatContainer.jsx'

function Home() {
  return (
    <>
      <div className='max-h-[100vh] '>
        <Topbar />
        <div className='flex'>
          <Sidebar />
          <ChatList/>
          <ChatContainer />
        </div>
      </div>
    </>
  )
}

export default Home