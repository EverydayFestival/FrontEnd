import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import FestivalCard from '../components/FestivalCard';
import CompanyCard from '../components/CompanyCard';
import Pagination from '../components/Pagination';
import '../styles/Home.css';
import Navbar from '../components/Navbar';
import React from 'react';

// URL의 쿼리 파라미터를 쉽게 가져오기 위한 커스텀 훅
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Search() {
    const query = useQuery();
    const searchTerm = query.get("query") || "";

    const [selectedTab, setSelectedTab] = useState('festival');
    
    // API 응답 데이터를 저장할 state
    const [results, setResults] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    // 로딩 및 에러 상태 추가
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // 검색어, 탭, 정렬, 페이지가 변경될 때마다 API를 새로 호출합니다.
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

            // 탭에 따라 API 엔드포인트 결정
            const endpoint = selectedTab === 'festival' ? '/festivals/search' : '/companies/search';
            
            // 서버에 보낼 검색 조건
            const searchParams = {
                keyword: searchTerm,
                page: currentPage - 1,
                size: itemsPerPage
            };

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(searchParams)
                });

                if (!response.ok) {
                    throw new Error(`HTTP 에러! 상태: ${response.status}`);
                }

                const result = await response.json();
                setResults(result.data.content);
                setTotalItems(result.data.totalElements);

            } catch (err) {
                setError(err.message);
                setResults([]); // 에러 발생 시 기존 결과 초기화
                setTotalItems(0);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchTerm, selectedTab, currentPage]); // 의존성 배열

    const renderContent = () => {
        if (loading) {
            return <div className="w-full text-center p-10">검색 중...</div>;
        }
        if (error) {
            return <div className="w-full text-center p-10 text-red-500">에러: {error}</div>;
        }
        if (results.length === 0) {
            return <div className="w-full text-center p-10">검색 결과가 없습니다.</div>;
        }

        return (
            <div className="card-container">
                {selectedTab === 'festival' ?
                    results.map((festival) => (
                        <FestivalCard key={festival.id} festival={festival} />
                    ))
                    :
                    results.map((company) => (
                        <CompanyCard
                            key={company.id}
                            company={{
                                companyId: company.id,
                                companyName: company.name,
                                companyCategory: company.category,
                                companyCity: company.city,
                                favored: company.favorStatus === 'FAVORED',
                                imageUrl: company.imageUrl
                            }}
                        />
                    ))
                }
            </div>
        );
    };

    return (
        <div>
            <Navbar />
            <Header />
            <Tabs 
                selectedTab={selectedTab}
                setSelectedTab={(tab) => {
                    setSelectedTab(tab);
                    setCurrentPage(1);
                }}
            />

            <div className="p-4">
                <p className="text-lg">
                    <span className="font-bold text-blue-600">'{searchTerm}'</span>에 대한 검색 결과입니다. ({totalItems}건)
                </p>
            </div>

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

export default Search;