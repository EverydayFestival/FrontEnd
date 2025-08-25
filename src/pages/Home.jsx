import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Tabs from '../components/Tabs';
import FestivalCard from '../components/FestivalCard';
import CompanyCard from '../components/CompanyCard'; // CompanyCard로 수정
import Pagination from '../components/Pagination';
import '../styles/Home.css';
import Navbar from '../components/Navbar.jsx';
import axios from 'axios'; // 오타 수정
import Box from '../components/Box.jsx';

function Home() {
  const [festivals, setFestivals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false); // 초기 로딩 상태를 false로 변경
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('festival');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 하나의 useEffect로 모든 데이터 로딩 로직을 통합합니다.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const searchParams = {
          keyword: "",
          page: currentPage - 1,
          size: itemsPerPage,
        };

        let response;
        if (selectedTab === 'festival') {
          response = await axios.post(
            `${import.meta.env.VITE_API_URL}/festivals/search`,
            searchParams,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          setFestivals(response.data.data.content);
          setTotalItems(response.data.data.totalElements);

        } else if (selectedTab === 'company') {
          response = await axios.post(
            `${import.meta.env.VITE_API_URL}/companies/search`,
            searchParams,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          const formattedCompanies = response.data.data.content.map(company => ({
            companyId: company.id,
            companyName: company.name,
            companyCategory: company.category,
            companyCity: company.city,
            companyDistrict: company.district,
            favored: company.favorStatus === 'FAVORED',
            imageUrl: company.imageUrl
          }));
          
          setCompanies(formattedCompanies);
          setTotalItems(response.data.data.totalElements);
        }

      } catch (err) {
        setError(err.message || "데이터를 불러오는 데 실패했습니다.");
        console.error("데이터 로딩 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab, currentPage]); // selectedTab 또는 currentPage가 변경될 때마다 실행

  const renderContent = () => {
    if (loading) return <div className="w-full text-center p-10">로딩 중...</div>;
    if (error) return <div className="w-full text-center p-10 text-red-500">에러: {error}</div>;

    if (selectedTab === 'festival') {
      if (festivals.length === 0) return <div className="w-full text-center p-10">등록된 축제가 없습니다.</div>;
      
      return (
        // Tailwind 클래스를 제거하고 card-container 클래스 사용
        <div className="card-container">
          {festivals.map((festival) => (
            <FestivalCard key={festival.id} festival={festival} />
          ))}
        </div>
      );
    }

    if (selectedTab === 'company') {
      if (companies.length === 0) return <div className="w-full text-center p-10">등록된 업체가 없습니다.</div>;
      
      return (
        // Tailwind 클래스를 제거하고 card-container 클래스 사용
        <div className="card-container">
          {companies.map((company) => (
            <CompanyCard key={company.companyId} company={company} />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
      <div className = "home-container">
      <div className = "navbar-wrapper">
      <Navbar/>
      </div>
      <div className = "header-wrapper">
      <Header />
      </div>
      <div className = "banner-wrapper">
      <Banner />
      </div>
      <div className = "tabs-wrapper">
      <Tabs 
        selectedTab={selectedTab} 
        setSelectedTab={(tab) => {
            setSelectedTab(tab);
            setCurrentPage(1); // 탭 변경 시 페이지를 1로 초기화
        }}
      />
      </div>
      {renderContent()}
    
      {/* totalItems가 0보다 클 때만 페이지네이션을 렌더링합니다. */}
      {totalItems > 0 && (
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

export default Home;
