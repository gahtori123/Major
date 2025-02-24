import React from 'react'
import Sidebar from '../Components/Sidebar'
import Topbar from '../Components/Topbar'
// import ChatSideBar from '../Components/ChatContainer'
import Layout from '../Layout/layout'
import ChatList from '../Components/ChatList.jsx'
import ChatContainer from '../Components/ChatContainer.jsx'

function Home() {
  return (
    <>
      <div>
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