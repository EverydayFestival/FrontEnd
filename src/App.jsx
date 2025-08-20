import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MyPage from './pages/MyPage/MyPage'
import MPFestivalOngoing from './pages/MyPageFestival/MPFestivalOngoing'
import MPFestivalClosed from './pages/MyPageFestival/MPFestivalClosed'
import MPFestivalAppliedCompany from './pages/MyPageFestival/MPFestivalAppliedCompany'
import MPFestivalAppliedLabor from './pages/MyPageFestival/MPFestivalAppliedLabor'
import MPFestivalReview2Company from './pages/MyPageFestival/MPFestivalReview2Company'
import MPFestivalNotification from './pages/MyPageFestival/MPFestivalNotification'
import MPFestivalInterest2Company from './pages/MyPageFestival/MPFestivalInterest2Company'
import MPFestivalFavored from './pages/MyPage/MPFavored'
import MPCompanyApply from './pages/MyPage/MyPageCompany/MPCompanyApply'


const App = ()=>{
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/mypage' element={<MyPage/>}/>
        <Route path='/mypage/festival/ongoing' element={<MPFestivalOngoing/>}/>
        <Route path='/mypage/festival/closed' element={<MPFestivalClosed/>}/>
        <Route path='/mypage/festival/appliedcompany/:festivalId' element={<MPFestivalAppliedCompany/>}/>
        <Route path='/mypage/festival/appliedlabor/:festivalId' element={<MPFestivalAppliedLabor/>}/>
        <Route path='/mypage/festival/appliedcompany/:festivalId/:companyId/review' element={<MPFestivalReview2Company/>}/>
        <Route path='/mypage/festival/notification' element={<MPFestivalNotification/>}/>
        <Route path='/mypage/festival/interest' element={<MPFestivalInterest2Company/>}/>
        <Route path='/mypage/favored' element={<MPFestivalFavored/>}/>

        <Route path='/mypage/company/apply' element={<MPCompanyApply/>}/>
      </Routes>
    </div>


  )

}

export default App
