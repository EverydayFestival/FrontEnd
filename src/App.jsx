import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MyPageFestival from './pages/MyPage/MyPageFestival.jsx'
import MyPageCompany from './pages/MyPage/MyPageCompany.jsx'
import MyPageLabor from './pages/MyPage/MyPageLabor.jsx'
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
import SelectFestivalPage from './pages/SelectFestivalPage.jsx'

//서정
import { BrowserRouter as Router,Navigate, Link } from 'react-router-dom';
import Search from './pages/Search';
import ServiceIntro from './pages/ServiceIntro';
import FestivalRegister from './pages/FestivalRegister';
import Inquiry from './pages/Inquiry';
import FestivalDetail from "./pages/FestivalDetail";
import CompanyDetail from "./pages/CompanyDetail.jsx";
import RecruitCompany from "./pages/RecruitCompany";
import RecruitWorker from "./pages/RecruitWorker";
import Login from './pages/Login.jsx';
import RecruitCompanyResult from './pages/RecruitCompanyResult.jsx';
import RecruitWorkerResult from './pages/RecruitWorkerResult.jsx';
import AllReviewsPage from './pages/AllReviewsPage.jsx';
import AllReviewPageCompany from './pages/AllReviewPageCompany.jsx'

import { FestivalProvider } from "./context/FestivalContext.jsx";
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import MyPageRouter from './components/MyPageRouter.jsx';
import './styles/App.css';


// 권한 없음 페이지 (간단한 예시)
function UnauthorizedPage() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>403 - 접근 권한이 없습니다.</h1>
            <p>이 페이지에 접근할 수 있는 권한이 없습니다.</p>
            {/* a href 대신 Link to를 사용하여 페이지 새로고침 방지 */}
            <Link to="/" className="text-blue-500 hover:underline">홈으로 돌아가기</Link>
        </div>
    );
}


const App = ()=>{

  const allRoles = ["축제기획자", "업체", "단기근로자"];

  return (
    <FestivalProvider>
      <AuthProvider>
      <div>
        <Routes>
          
          <Route path='/mypage' element={<PrivateRoute allowedRoles={allRoles}><MyPageRouter/></PrivateRoute>}/>
          <Route path='/mypage/festival' element={<MyPageFestival/>}/>
          <Route path='/mypage/company' element={<MyPageCompany/>}/>
          <Route path='/mypage/labor' element={<MyPageLabor/>}/>
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

          {/* PrivateRoute로 감싸지 않은 공개 라우트 */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/service-intro" element={<ServiceIntro/>} />

          {/* PrivateRoute로 보호되는 라우트들 */}
          <Route path="/" element={<PrivateRoute allowedRoles={allRoles}><Home/></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute allowedRoles={allRoles}><Search /></PrivateRoute>} />
          

        {/* '축제 기획자'만 접근 가능한 라우트 */}
        <Route path="/festival-register" element={<PrivateRoute allowedRoles={["축제기획자"]}><FestivalRegister/></PrivateRoute>} />
        <Route path="/select-festival" element={<PrivateRoute allowedRoles={["축제기획자"]}><SelectFestivalPage /></PrivateRoute>} />
        
        <Route path="/inquiry" element={<PrivateRoute allowedRoles={allRoles}><Inquiry/></PrivateRoute>} />
        <Route path="/festivals/:id" element={<PrivateRoute allowedRoles={allRoles}><FestivalDetail /></PrivateRoute>} />
        <Route path="/company/:id" element={<PrivateRoute allowedRoles={allRoles}><CompanyDetail/></PrivateRoute>} />
        <Route path="/recruit/company/:id" element={<PrivateRoute allowedRoles={allRoles}><RecruitCompany /></PrivateRoute>} />
        <Route path="/recruit/worker/:id" element={<PrivateRoute allowedRoles={allRoles}><RecruitWorker /></PrivateRoute>} /> 
        <Route path="/application/result/:applicationId" element={<PrivateRoute allowedRoles={allRoles}><RecruitCompanyResult /></PrivateRoute>} />
        <Route path="/recruit/worker/:id/result" element={<PrivateRoute allowedRoles={allRoles}><RecruitWorkerResult /></PrivateRoute>} />
        <Route path="/festivals/:id/reviews" element={<PrivateRoute allowedRoles={allRoles}><AllReviewsPage /></PrivateRoute>} />
        <Route path="/company/:id/reviews" element={<PrivateRoute allowedRoles={allRoles}><AllReviewPageCompany /></PrivateRoute>} />

        {/* 일치하는 라우트가 없을 경우 기본 페이지로 이동 */}
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>


      </AuthProvider>
    </FestivalProvider>
  )

}

export default App
