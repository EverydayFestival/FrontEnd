import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './pages/Home';
//import Search from './pages/Search';
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
import FestivalReview from './components/FestivalReview.jsx';
import CompanyReview from './components/CompanyReview.jsx';

import { FestivalProvider } from "./context/FestivalContext.jsx";
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

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


function App() {
  // 모든 로그인 사용자가 접근 가능한 페이지의 역할 목록
  const allRoles = ["축제 기획자", "업체", "단기 근로자"];

  return (
    <FestivalProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* PrivateRoute로 감싸지 않은 공개 라우트 */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/service-intro" element={<ServiceIntro/>} />

              {/* PrivateRoute로 보호되는 라우트들 */}
              <Route path="/" element={<PrivateRoute allowedRoles={allRoles}><Home/></PrivateRoute>} />
              {/*<Route path="/search" element={<PrivateRoute allowedRoles={allRoles}><Search /></PrivateRoute>} /> */}
              
              {/* '축제 기획자'만 접근 가능한 라우트 */}
              <Route path="/festival-register" element={<PrivateRoute allowedRoles={["축제 기획자"]}><FestivalRegister/></PrivateRoute>} />
              
              <Route path="/inquiry" element={<PrivateRoute allowedRoles={allRoles}><Inquiry/></PrivateRoute>} />
              <Route path="/festivals/:id" element={<PrivateRoute allowedRoles={allRoles}><FestivalDetail /></PrivateRoute>} />
              <Route path="/festivals/:id/reviews" element={<PrivateRoute allowedRoles={allRoles}><FestivalReview /></PrivateRoute>} />
              <Route path="/company/:id" element={<PrivateRoute allowedRoles={allRoles}><CompanyDetail/></PrivateRoute>} />
              <Route path="/company/:id/reviews" element={<PrivateRoute allowedRoles={allRoles}><CompanyReview /></PrivateRoute>} />
              <Route path="/recruit/company/:id" element={<PrivateRoute allowedRoles={allRoles}><RecruitCompany /></PrivateRoute>} />
              <Route path="/recruit/worker/:id" element={<PrivateRoute allowedRoles={allRoles}><RecruitWorker /></PrivateRoute>} /> 
              <Route path="/recruit/company/:id/result" element={<PrivateRoute allowedRoles={allRoles}><RecruitCompanyResult /></PrivateRoute>} />
              <Route path="/recruit/worker/:id/result" element={<PrivateRoute allowedRoles={allRoles}><RecruitWorkerResult /></PrivateRoute>} />

              {/* 일치하는 라우트가 없을 경우 기본 페이지로 이동 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </FestivalProvider>
  );
}

export default App;
