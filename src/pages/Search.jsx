/* import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import FestivalCard from '../components/FestivalCard';
import CompanyCard from '../components/CompanyCard';
import Pagination from '../components/Pagination';
// mainPageData 대신 새로운 검색 결과 더미 데이터를 import 합니다.
import { searchResultData } from '../data/searchResultData';
import '../styles/Home.css'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Search() {
    const query = useQuery();
    const searchTerm = query.get("query") || "";

    const [selectedTab, setSelectedTab] = useState('festival');
    const [selectedSort, setSelectedSort] = useState('latest');
    
    // API 응답 전체를 저장할 state
    const [festivalResult, setFestivalResult] = useState({ data: { content: [], totalElements: 0 } });
    const [companyResult, setCompanyResult] = useState({ data: { content: [], totalElements: 0 } });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 한 페이지에 보여줄 아이템 수

    // searchTerm이나 정렬 순서가 바뀔 때마다 데이터를 "가져온다"고 가정합니다.
    useEffect(() => {
        // 나중에는 이 부분에 실제 fetch API 호출이 들어갑니다.
        // 예: fetch(`/api/search/festivals?query=${searchTerm}&sort=${selectedSort}&page=${currentPage}`)
        
        // 지금은 더미 데이터로 필터링 및 정렬을 시뮬레이션합니다.
        const filteredFestivals = searchResultData.data.content.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const sortedFestivals = [...filteredFestivals].sort((a, b) => {
            if (selectedSort === 'latest') {
                return new Date(b.period.begin) - new Date(a.period.begin);
            }
            if (selectedSort === 'popular') {
                return (b.favorStatus === 'FAVORED' ? 1 : 0) - (a.favorStatus === 'FAVORED' ? 1 : 0);
            }
            return 0;
        });

        setFestivalResult({ data: { ...searchResultData.data, content: sortedFestivals, totalElements: sortedFestivals.length } });

        // 업체 검색 로직 (동일한 방식으로)
        const filteredcompanies = SearchResultData.data.content.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCompanyResult({ data: { ...companySearchResultData.data, content: filteredCompanies, totalElements: filteredcompanies.length } });

    }, [searchTerm, selectedSort]);

    // 현재 페이지에 보여줄 아이템들을 계산합니다.
    const currentList = selectedTab === 'festival' ? festivalResult.data.content : companyResult.data.content;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = currentList.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            <Header />
            <Tabs 
                selectedTab={selectedTab}
                setSelectedTab={(tab) => {
                    setSelectedTab(tab);
                    setCurrentPage(1); // 탭 변경 시 1페이지로 초기화
                }}
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
            />

            <div className="p-4">
                <p className="text-lg">'{searchTerm}'에 대한 검색 결과입니다.</p>
            </div>

            <div className="card-container">
                {selectedTab === 'festival' &&
                    currentItems.map((festival) => (
                        // FestivalCard가 새로운 데이터 구조를 받을 수 있도록 props를 수정합니다.
                        <FestivalCard 
                            key={festival.id}
                            festival={{ // mainPageData 형식과 유사하게 맞춰 전달
                                festivalId: festival.id,
                                festivalName: festival.name,
                                festivalOrganization: festival.holderName,
                                festivalHoldBegin: festival.period.begin,
                                favored: festival.favorStatus === 'FAVORED',
                                imageUrl: festival.imageUrl
                            }}
                        />
                    ))
                }

                {selectedTab === 'company' &&
                    currentItems.map((company) => (
                        <CompanyCard
                            key={company.id}
                            company={{ // CompanyCard가 받을 데이터 형식
                                companyId: company.id,
                                companyName: company.name,
                                companyCategory: company.category,
                                companyCity: company.address.city,
                                favored: company.favored,
                                imageUrl: company.imageUrl
                            }}
                        />
                    ))
                }
            </div>

            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={selectedTab === 'festival' ? festivalResult.data.totalElements : companyResult.data.totalElements}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}

export default Search;
 */