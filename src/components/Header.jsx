import React from "react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../styles/Header.css';


function Header() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    const { logout } = useContext(AuthContext);

    return (
        <header className="header">
            <div className="searchbar">
                <input 
                type="text" 
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                <button onClick={handleSearch}>🔍</button>
            </div>
        <div className="detail-tabs">
            <Link to ="/service-intro">
                <button>서비스 소개</button>
            </Link>
            <Link to="/festival-register">
                <button>축제 등록하기</button>
            </Link>
            <Link to="/inquiry">
                <button>문의하기</button>
            </Link>
        </div>
    </header>
  );
}

export default Header;
