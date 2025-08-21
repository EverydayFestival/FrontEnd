import Header from "../components/Header";

function ServiceIntro() {
    return (
        <div>
            <Header />
            <h1>서비스 소개 페이지</h1>
            <div className="logo">
                <img src={"/images/logo.png"} alt="Logo"/>
            </div>
            <p>‘오늘도 축제로다’는 
                서울 마포구의 다양한 지역 축제를 한곳에 모아보고, 기획자–업체–단기근로자가 손쉽게 연결될 수 있도록 돕는 플랫폼입니다. 
                지금까지 축제 정보는 여러 채널에 흩어져 있어 모두가 불편을 겪어왔습니다. 
                우리 서비스는 행사 일정, 참여 업체 모집, 단기 채용 공고를 통합해 누구나 간편하게 확인하고 신청할 수 있도록 합니다. 
                또한 AI 추천 기능을 통해 기획자에게는 필요한 인력을, 업체와 근로자에게는 적합한 축제 정보를 제공해줍니다. 
                이제 흩어진 정보를 찾아 헤맬 필요 없이, 축제와 관련된 모든 것을 ‘오늘도 축제로다’에서 한 번에 경험하세요!</p>
        </div>
    );
}

export default ServiceIntro;