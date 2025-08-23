import { useEffect, useState } from "react";
import React from "react";

function FestivalList() {
    const [festivals, setFestivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FestivalList.jsx 파일

// FestivalList.jsx 파일

useEffect(() => {
    const fetchFestivals = async () => {
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
                page: 0,
                size: 10
            };

            // 2. method를 'POST'로 변경하고, 검색 조건을 body에 담아 보냅니다.
            const response = await fetch("/api/festivals/search", {
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
            setFestivals(result.data.content);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchFestivals();
}, []);

    if (loading) {
        return <div className="text-center p-10">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">에러: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">축제 목록</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* 불러온 축제 데이터를 map으로 순회하며 FestivalCard를 렌더링합니다. */}
                {festivals.map((festival) => (
                    <FestivalCard key={festival.id} festival={festival} />
                ))}
            </div>
        </div>
    );
}

export default FestivalList;