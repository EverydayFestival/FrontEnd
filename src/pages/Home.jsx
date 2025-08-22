import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Tabs from '../components/Tabs';
import FestivalCard from '../components/FestivalCard';
import CompanyCard from '../components/CompanyCard.jsx';
import Pagination from '../components/Pagination';
import { getMainPageData } from '../data/mainPageData.js';
import { FestivalContext } from '../context/FestivalContext.jsx';
import '../styles/Home.css';
import Navbar from '../components/Navbar.jsx';

function Home() {
  // Context에서 실시간으로 업데이트되는 전체 축제 목록을 가져옵니다. (이름은 allFestivals로)
  const { festivals: allFestivals } = useContext(FestivalContext);

  const [selectedTab, setSelectedTab] = useState('festival');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 업체(Company) 목록은 mainPageData에서 한 번만 불러옵니다.
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const pageData = getMainPageData();
    if (pageData.success) {
      setCompanies(pageData.data.companyList);
    }
  }, []);

  // Context에서 가져온 상세 축제 데이터를 FestivalCard가 사용할 수 있는 형태로 변환합니다.
  const festivalListForCards = allFestivals.map(fest => ({
      festivalId: fest.id,
      festivalName: fest.data.festivalOnlyDto.name,
      festivalOrganization: fest.data.festivalOnlyDto.holderName,
      festivalHoldBegin: fest.data.festivalOnlyDto.periodDto.begin,
      favored: fest.data.festivalOnlyDto.favorStatus === 'FAVORED',
      imageUrl: fest.data.festivalOnlyDto.imageUrl
  }));

  // 현재 페이지에 보여줄 아이템 목록을 계산합니다.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // [오류 수정] 'festivals' 대신 'festivalListForCards'를 사용합니다.
  const currentFestivalList = festivalListForCards.slice(indexOfFirstItem, indexOfLastItem);
  const currentCompanyList = companies.slice(indexOfFirstItem, indexOfLastItem);

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

      <div className="card-container">
        {selectedTab === 'festival' &&
          currentFestivalList.map((festival) => (
            <FestivalCard 
              key={festival.festivalId}
              festival={festival}
            />
          ))
        }

        {selectedTab === 'company' &&
          currentCompanyList.map((company) => (
            <CompanyCard
              key={company.companyId}
              company={company}
            />
          ))
        }
      </div>

      <Pagination
        itemsPerPage={itemsPerPage}
        // [오류 수정] 'festivals.length' 대신 'festivalListForCards.length'를 사용합니다.
        totalItems={selectedTab === 'festival' ? festivalListForCards.length : companies.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default Home;
