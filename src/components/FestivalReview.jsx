import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/FestivalReview.css"

export default function FestivalReview({ festivalId }) {
    const [reviews, setReviews] = useState([]);
    const [reviewType, setReviewType] = useState('COMPANY'); // 기본값: 업체 리뷰
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            setError(null);

            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("리뷰를 보려면 로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            try {
                // reviewType 상태값('COMPANY' 또는 'LABOR')에 따라 API 호출
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/festivals/${festivalId}/reviews?senderType=${reviewType}&page=0&size=3`, 
                    {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    }
                );
                
                if (!response.ok) throw new Error("리뷰를 불러오는 데 실패했습니다.");

                const result = await response.json();
                if (result.success) {
                    setReviews(result.data.content);
                } else {
                    throw new Error(result.message);
                }

            } catch (err) {
                setError(err.message);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [festivalId, reviewType]);

    const renderReviews = () => {
        if (loading) {
            return <p className="text-center text-gray-500">리뷰를 불러오는 중...</p>;
        }
        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }
        if (reviews.length === 0) {
            return <p className="text-center text-gray-500">작성된 리뷰가 없습니다.</p>;
        }
        
        return reviews.map(review => (
            <div key={review.id} className="border-b py-4">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <span className="font-semibold">{review.senderName}</span>
                </div>
                <div className="pl-12">
                    <p className="p-3 bg-gray-100 rounded-lg">{review.content}</p>
                </div>
            </div>
        ));
    };

    return (
        <section className="festival-review-section">
    <div className="flex justify-between items-center mb-4">
        <h2>리뷰</h2>
        <select value={reviewType} onChange={(e) => setReviewType(e.target.value)}>
            <option value="COMPANY">업체 리뷰</option>
            <option value="LABOR">근로자 리뷰</option>
        </select>
    </div>

    {loading && <p className="review-message">리뷰를 불러오는 중...</p>}
    {error && <p className="review-message error">{error}</p>}
    {reviews.length === 0 && !loading && <p className="review-message">작성된 리뷰가 없습니다.</p>}

    {reviews.map(review => (
        <div key={review.id} className="review-card">
            <div className="review-card-header">
                <div className="review-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </div>
                <span className="review-sender">{review.senderName}</span>
            </div>
            <div className="review-content">
                <p className="review-text">{review.content}</p>
            </div>
        </div>
    ))}

    {reviews.length > 0 && (
        <div className="review-more">
            <Link to={`/festivals/${festivalId}/reviews`}>리뷰 더 보기</Link>
        </div>
    )}
</section>

    );
}