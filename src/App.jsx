import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MyPage from './pages/MyPageFestival/MyPage'
import MPFestivalOngoing from './pages/MyPageFestival/MPFestivalOngoing'
import MPFestivalClosed from './pages/MyPageFestival/MPFestivalClosed'
import MPFestivalAppliedCompany from './pages/MyPageFestival/MPFestivalAppliedCompany'
import MPFestivalAppliedLabor from './pages/MyPageFestival/MPFestivalAppliedLabor'

const App = ()=>{
  return (
    <div>
      <Routes>
        <Route path='/mypage' element={<MyPage/>}/>
        <Route path='/mypage/festival/ongoing' element={<MPFestivalOngoing/>}/>
        <Route path='/mypage/festival/closed' element={<MPFestivalClosed/>}/>
        <Route path='/mypage/festival/appliedcompany/:festivalId' element={<MPFestivalAppliedCompany/>}/>
        <Route path='/mypage/festival/appliedlabor/:festivalId' element={<MPFestivalAppliedLabor/>}/>
      </Routes>
    </div>


  )

}

export default App
