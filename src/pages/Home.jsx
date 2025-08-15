// Home.jsx
import React from 'react'

const Home = () => {
  console.log("Home 렌더링됨")

  return (
    <div className='home' style={{ padding: '100px', textAlign: 'center' }}>
      <h1 style={{ color: 'white', fontSize: '36px' }}>✅ Home 화면입니다!</h1>
    </div>
  )
}

export default Home
