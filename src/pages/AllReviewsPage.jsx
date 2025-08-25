import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import "../styles/AllReviewsPage.css"

export default function AllReviewsPage() {
    const { id: festivalId } = useParams();
    const location = useLocation();
    const festivalName = location.state?.festivalName || "축제";
    const [activeTab, setActiveTab] = useState('company'); 
    const [reviews, setReviews] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllReviews = async () => {
            setLoading(true);
            setError(null);

            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("리뷰를 보려면 로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            const senderType = activeTab === 'company' ? 'COMPANY' : 'LABOR';

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/festivals/${festivalId}/reviews?senderType=${senderType}&page=0&size=20`,
                    {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    }
                );

                if (!response.ok) {
                    throw new Error("리뷰를 불러오는 데 실패했습니다.");
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

        fetchAllReviews();
    }, [activeTab, festivalId]);

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
                {/* ===== 수정된 부분: key={review.id} -> key={index} ===== */}
                {reviews.map((review, index) => (
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

            <div className="all-reviews-header">
                <Link to={`/festivals/${festivalId}`} className="back-link">
                    &larr; {festivalName} 상세 페이지로 돌아가기
                </Link>
                <h1>전체 리뷰</h1>
            </div>

            <div className="reviews-tab">
                <button 
                    className={activeTab === 'company' ? 'active' : ''}
                    onClick={() => setActiveTab('company')}
                >
                    업체
                </button>
                <button 
                    className={activeTab === 'worker' ? 'active' : ''}
                    onClick={() => setActiveTab('worker')}
                >
                    단기 근로자
                </button>
            </div>

            <p className="total-reviews">총 {totalElements}개의 리뷰가 있습니다.</p>

            {loading && <p className="review-message">리뷰를 불러오는 중...</p>}
            {error && <p className="review-message error">{error}</p>}
            {reviews.length === 0 && !loading && <p className="review-message">작성된 리뷰가 없습니다.</p>}

            <div className="review-list">
                {reviews.map((review, index) => (
                    <div key={index} className="review-card">
                        <p className="review-sender">{review.senderName}</p>
                        <p className="review-content">{review.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}