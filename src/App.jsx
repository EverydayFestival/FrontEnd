import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MyPage from './pages/MyPage/MyPage'
import MPFestivalOngoing from './pages/MyPage/MyPageFestival/MPFestivalOngoing'
import MPFestivalClosed from './pages/MyPage/MyPageFestival/MPFestivalClosed'
import MPFestivalAppliedCompany from './pages/MyPage/MyPageFestival/MPFestivalAppliedCompany'
import MPFestivalAppliedLabor from './pages/MyPage/MyPageFestival/MPFestivalAppliedLabor'
import MPFestivalReview2Company from './pages/MyPage/MyPageFestival/MPFestivalReview2Company'
import MPFestivalNotification from './pages/MyPage/MyPageFestival/MPFestivalNotification'
import MPFestivalFavored from './pages/MyPage/MPFavored'
import MPCompanyApply from './pages/MyPage/MyPageCompany/MPCompanyApply'
import MPCompanyReview2Festival from './pages/MyPage/MyPageCompany/MPCompanyReview2Festival'
import MPLaborApply from './pages/MyPage/MyPageLabor/MPLaborApply'
import MPLaborReview2Festival from './pages/MyPage/MyPageLabor/MPLaborReview2Festival'


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
        <Route path='/mypage/favored' element={<MPFestivalFavored/>}/>

        <Route path='/mypage/company/apply' element={<MPCompanyApply/>}/>
        <Route path='/mypage/company/:festivalId/review' element={<MPCompanyReview2Festival/>}/>

        <Route path='/mypage/labor/apply' element={<MPLaborApply/>}/>
        <Route path='/mypage/labor/:festivalId/review' element={<MPLaborReview2Festival/>}/>
      </Routes>
    </div>


  )

}

export default App
