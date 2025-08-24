import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AllReviewPageCompany() {
    // 1. URL로부터 companyId를 가져옵니다.
    const { id: companyId } = useParams();
    const location = useLocation();
    
    // 이전 페이지에서 업체 이름을 받아오거나 기본값을 사용합니다.
    const companyName = location.state?.companyName || "업체";

    // 2. 리뷰 데이터, 로딩, 에러 상태를 관리합니다.
    const [reviews, setReviews] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. 컴포넌트가 마운트되거나 companyId가 변경될 때 API를 호출합니다.
    useEffect(() => {
        const fetchAllCompanyReviews = async () => {
            setLoading(true);
            setError(null);

            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("리뷰를 보려면 로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/companies/${companyId}/reviews?page=0&size=20`,
                    {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "리뷰를 불러오는 데 실패했습니다.");
                }

                const result = await response.json();
                if (result.success) {
                    setReviews(result.data.content);
                    setTotalElements(result.data.totalElements);
                } else {
                    throw new Error(result.message || "리뷰 데이터를 가져오는 데 실패했습니다.");
                }

            } catch (err) {
                setError(err.message);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchAllCompanyReviews();
        }
    }, [companyId]); // companyId가 변경되면 다시 데이터를 불러옵니다.

    // 4. 상태에 따라 내용을 렌더링하는 함수입니다.
    const renderContent = () => {
        if (loading) {
            return <p className="text-center text-gray-500 mt-8">리뷰를 불러오는 중...</p>;
        }
        if (error) {
            return <p className="text-center text-red-500 mt-8">{error}</p>;
        }
        if (reviews.length === 0) {
            return <p className="text-center text-gray-500 mt-8">작성된 리뷰가 없습니다.</p>;
        }
        return (
            <div className="space-y-4">
                {reviews.map((review, index) => (
                    // API 응답에 id가 없으므로 index를 key로 사용합니다.
                    <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                        <p className="font-semibold text-lg">{review.senderName}</p>
                        <p className="text-gray-700 mt-1">"{review.content}"</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <Navbar />
            <div className="mb-6">
                {/* 업체 상세 페이지로 돌아가는 링크 */}
                <Link to={`/company/${companyId}`} state={{ companyName }} className="text-blue-600 hover:underline">
                    &larr; {companyName} 상세 페이지로 돌아가기
                </Link>
                <h1 className="text-3xl font-bold mt-2">{companyName} 전체 리뷰</h1>
            </div>

            <div className="mt-4">
                <p className="text-gray-600 mb-4">총 {totalElements}개의 리뷰가 있습니다.</p>
                {renderContent()}
            </div>
        </div>
    );
}