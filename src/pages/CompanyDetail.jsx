import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { companies } from "../data/companies";
// 이제 'festivals'는 추천 축제 목록 배열을 직접 가져옵니다.
import { festivals } from "../data/recommendedFestivals"; 
import CompanyReview from "../components/CompanyReview";
import FestivalCard from "../components/FestivalCard";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [favored, setFavored] = useState(false);

  useEffect(() => {
    const found = companies.find((c) => c.id === Number(id));
    if (found) {
        setCompany(found);
        setFavored(found.data.favorStatus === "FAVORED");
    }
  }, [id]);

  if (!company) return <p className="text-center mt-8">업체를 찾을 수 없습니다.</p>;

  const { data } = company;

  const reviews = [
    { id: 1, type: "festival", author: "서울 빛초롱 축제", content: "덕분에 행사가 풍성해졌습니다. 감사합니다!"},
    { id: 2, type: "festival", author: "진해 군항제", content: "매년 함께하고 싶은 최고의 파트너입니다."},
  ];

  const toggleFavorite = () => {
    setFavored((prev) => !prev);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
        <section className="flex items-center gap-4">
            <img 
                src={data.imageUrl || '/images/manager_default.jpg'} 
                alt={data.name} 
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/96x96/e2e8f0/4a5568?text=...'; }}
            />
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{data.name}</h1>
                    <button onClick={toggleFavorite}>
                        {favored ? (
                            <FaStar size={28} className="text-yellow-400" />
                        ) : (
                            <FaRegStar size={28} className="text-gray-400" />
                        )}
                    </button>
                </div>
                <p className="text-lg text-gray-600">{data.category}</p>
            </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg space-y-2">
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">업체 정보</h2>
            <p><strong>소개:</strong> {data.introduction}</p>
            <p><strong>대표자:</strong> {data.ceoName}</p>
            <p><strong>주소:</strong> {data.addressDto.city} {data.addressDto.district} ({data.addressDto.detail})</p>
            <p><strong>전화:</strong> {data.tel}</p>
            <p><strong>이메일:</strong> {data.email}</p>
            {data.link && <a href={data.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">웹사이트 바로가기</a>}
        </section>

        <CompanyReview reviews={reviews} companyId={id} />

        <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              이런 축제는 어떠세요?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* festivals 배열을 직접 map으로 순회합니다. */}
                {festivals.slice(0, 3).map((fest) => (
                    // FestivalCard가 필요로 하는 festival prop 객체 구조에 맞춰 전달합니다.
                    <FestivalCard
                        key={fest.festivalId}
                        festival={{
                            festivalId: fest.festivalId,
                            festivalName: fest.festivalName,
                            festivalOrganization: fest.festivalOrganization,
                            festivalHoldBegin: fest.festivalHoldBegin,
                            favored: fest.favored === 'FAVORED', // 'FAVORED' 문자열을 boolean 값으로 변환
                            imageUrl: fest.imageUrl
                        }}
                    />
                ))}
            </div>
        </section>
    </div>
  );
}