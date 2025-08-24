import React from 'react';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Tabs from '../components/Tabs';
import FestivalCard from '../components/FestivalCard';
import CompanyList from '../components/CompanyList.jsx';
import Pagination from '../components/Pagination';
import '../styles/Home.css';
import Navbar from '../components/Navbar.jsx';

function Home() {
  // Context에서 실시간으로 업데이트되는 전체 축제 목록을 가져옵니다. (이름은 allFestivals로)
  const [festivals, setFestivals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('festival');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

useEffect(() => {
    const fetchFestivals = async () => {
      if (selectedTab !== 'festival') return;

        setLoading(true);
        setError(null);
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            setError("로그인이 필요합니다.");
            setLoading(false);
            return;
        }

        try {
            // 1. 검색 조건을 객체로 만듭니다.
            const searchParams = {
                keyword: '',
                page: currentPage -1,
                size: itemsPerPage
            };

            // 2. method를 'POST'로 변경하고, 검색 조건을 body에 담아 보냅니다.
            const response = await fetch(`${import.meta.env.VITE_API_URL}/festivals/search`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json' // body가 JSON 형식임을 알려줍니다.
                },
                body: JSON.stringify(searchParams) // 객체를 JSON 문자열로 변환
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP 에러! 상태: ${response.status}`);
            }

            const result = await response.json();

            setFestivals(result.data.content);
            setTotalItems(result.data.totalElements);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchFestivals();
}, [selectedTab, currentPage]);

useEffect(() => {
  const fetchCompanies = async () => {

    if (selectedTab !== 'company') return;

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
        keyword: '',
        page: currentPage -1,
        size: itemsPerPage
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/companies/search`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(searchParams)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP 에러! 상태: ${response.status}`);
    }

    const result = await response.json();

    const formattedCompanies = result.data.content.map(company => ({
        companyId: company.id,
        companyName: company.name,
        companyCategory: company.category,
        companyCity: company.city,
        favored: company.favorStatus === 'FAVORED',
        imageUrl: company.imageUrl
    }));
    
    setCompanies(formattedCompanies);
    setTotalItems(result.data.totalElements);
  } catch (err) {
      setError(err.message);
  } finally {
      setLoading(false);
  }
};

fetchCompanies();
}, [selectedTab, currentPage]);

const renderContent = () => {
    if (loading) return <div className="w-full text-center p-10">로딩 중...</div>;
    if (error) return <div className="w-full text-center p-10 text-red-500">에러: {error}</div>;

    if (selectedTab === 'festival') {
      if (festivals.length === 0) return <div className="w-full text-center p-10">등록된 축제가 없습니다.</div>;
      
      // 축제 렌더링 부분은 card-container div로 감싸줍니다.
      return (
        <div className="card-container">
          {festivals.map((festival) => (
            <FestivalCard key={festival.id} festival={festival} />
          ))}
        </div>
      );
    }

    if (selectedTab === 'company') {
      if (companies.length === 0) return <div className="w-full text-center p-10">등록된 업체가 없습니다.</div>;
      // 직접 map을 돌리는 대신, CompanyList 컴포넌트를 사용하고
      // currentCompanyList를 props로 전달합니다.
      return (
      <div className="card-container">
        <CompanyList companies={companies} />
      </div>
    );
    }

    return null;
  };

  return (
    <div>
      <Navbar/>
      <Header />
      <Banner />
      <Tabs 
        selectedTab={selectedTab} 
        setSelectedTab={(tab) => {
            setSelectedTab(tab);
            setCurrentPage(1); // 탭 변경 시 페이지를 1로 초기화
        }}
      />
        {renderContent()}
    
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default Home;
