import React from "react";
import { FaUserPlus, FaSearch } from "react-icons/fa";
import { useState } from 'react';
import './index.css';

const connections = [
  {
    id: 1,
    name: "John Doe",
    title: "Software Engineer at Google",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "Product Manager at Microsoft",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 3,
    name: "Alex Johnson",
    title: "UX Designer at Apple",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 4,
    name: "Sarah Williams",
    title: "Data Scientist at Amazon",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  },  
  {
    id: 5,
    name: "suresh Babu",
    title: "Frontend Developer at NstarX",
    avatar: "https://media-hosting.imagekit.io/4247ff9765e34a29/Screenshot%202025-03-29%20141410.png?Expires=1837845894&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=G4iMTqB5FMaKA1soFPRd0AcIdzTcPOGf2UGg1~3lySJ4cEJ9jhkPFpAVs24oHv6JgFMzk1dgwjJKfZx6tZQ7IUOOk11~82dm33CzT~kOGQi6b3lL1LfeV5347nsaXeAnVhW9AYzGF-sE-EpGqpoe9mrlHyVGn3I~x5XhgdBJimBDzTSev0K16x9-EQTVksnDrdGurgW7ZZ9~NDaPOWp~f5yryNW2juV~X1E7IY9hk7VXMXjVYUmtU0stxdLV-guB8UkTgEo-7k94ZlwsKLruQv~J9P1ND9J0YFiIwchYP5gvCfigdT1N274yU1z~-x~ZfQDC6Z81T3LE84BR5w8a7w__"
  },  
  {
    id: 6,
    name: "Rajesh babu",
    title: "Aspiring Software developer",
    avatar: "https://media-hosting.imagekit.io/137782fbb5614090/Screenshot%202025-03-29%20142639.png?Expires=1837846623&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=YmQR8M9dN6x1QmwdSCRJdlWV6Ivqmop-udn~rqJwhmgrOfk8pW6UnPqZctuaE8ksKjUXZPQ2MFLkF0kgBpPEUiXD4zNv7r-9fqIjT682kc1t4UXGTRUYU-R~ZjUJOIipAKwS3R3c0Z0~86906-b4JpTutbPfUuUJHAwcaNJEsBy01gVBfb4zyOCt12jAzi9XG~nqsEadzJhrchpneP33ZrtBCPrTczSHhyh6g-oozbfjHgMygKZsitjJ4HbAPt5HSJWQjmFhQVrCqqJJDrqHnzK5D3ztPtCr0pMmKSn7oCrf05xi3cz73mnviKs8oER5DUWekcQwRlTjGQCTvXwNww__"
  },
  {
    id: 7,
    name: "Venkata Ramana",
    title: "Aspiring as Data Science Expert",
    avatar: "https://media-hosting.imagekit.io/8b97b777738b4151/Screenshot%202025-03-29%20142016.png?Expires=1837846260&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=AcP3SbEUpjQeNa76vcgGPwcrcWryuZ02wrWHMY18yzq~8USClWp~XPEw2XfqznMmaT3ykbtwNms6zk-EUieiLwxTry8lfIk1VaVRuFVzwx1bKZSQM-n2dWi5Q3Dk-VrMxLkNwgM~GR-gjk0UpvuQSrXHQiqYqrRUGTKwoXxdTn2B22HHp-agleD208rbTV-pDSr07hwbxqvSZwQVO6ijyL62PDz1wRvzqiZgXGpKCwD3ndh25ylVqAarfqopZLI7GdmDkzhulu3VsLhSrz6nUWOyhplftg9RlnWRsMYzVnjgJDBaqtdXFWROStRPzWtN3VjQhKAJM0GgtZnThwqyRw__"
  },{
    id: 8,
    name: "Jagadeesh V",
    title: "Aspiring Software Developer",
    avatar: "https://media-hosting.imagekit.io/aa13b1817d8a40c8/Screenshot%202025-03-29%20143014.png?Expires=1837846839&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=jEJbceg-yz4~4ah6o2WycTr23xre6DRM76BMJz-piOMeaXY0CdgU9Jy~e-tfMsV8DFDA9yCGjhibkKtmBWA3BXp0wzHEbBg23Jhsv-XqYizFaHnNyb-LeM~r60GtqkfL-YeeDGD2P~qSXAALF7GODZ3ziUSAXbtokKk2OY9bWqhuaduGeJnlC~zirF~US4bAj1NLxVF~jizdDE-KQQ~XwYBGDd1J1tMqP5FZpnhktJYBjH6wQKEumUXbspOox1JKZS-ZazCdAMCEEVBEl5aOIgTH060UwCBRL4uapZdM5XGXwUczKkQEDmRachyvhHw39xMcd52Ub8~nhRPyFYR90A__"
  },{
    id: 9,
    name: "Mahesh Babu",
    title: "CEO of SBHS Techs",
    avatar: "https://media-hosting.imagekit.io/6fbcbb5ba11f4ee4/Screenshot%202025-03-29%20143509.png?Expires=1837847133&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kS3I4E7JEM9-6Zf6c-faR0GceYdve9zIQLv9hPYLW~B6cntytG5-WQyRkQ~VWr7Tg6kXoR9UrtGwcksnBWBeriFX5Bk0-kINabkPUw~CcmWQr6ZIy-jlGGb2bDu1NKVjLXjHvHMaZNEE6I8PGb1oiCOQaK5jxuTfpQuHPmBz1hhb2Q7UVBEXgHKqM9Phu6cjmomMuULVF-W4q-1diDRYODY3Fd0UG~khk6S1ldMezlnwXv9cVZ1ALYg7oFLNn9JxEjQbJa90pAxjuHtFMpVZGgAW5o3mZgnsgRGUKe~6R~gMVF70rNkCqE~Ad53VKfKsuDMX4QQFSciUdngY0fg2vQ__"
  }
];

const MyNetwork = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredConnections = connections.filter(connection => 
    connection.name.toLowerCase().includes(searchTerm) ||
    connection.title.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="network-container">
      <div className="network-header">
        <h1>My Network</h1>
        <div className="network-search">
          <input 
            type="text" 
            placeholder="Search connections..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <div className="connections-list">
        <h2>Your Connections ({filteredConnections.length})</h2>
        
        <div className="connection-cards">
          {filteredConnections.map(connection => (
            <div key={connection.id} className="connection-card">
              <img 
                src={connection.avatar} 
                alt={connection.name} 
                className="connection-avatar"
              />
              <div className="connection-info">
                <h3>{connection.name}</h3>
                <p>{connection.title}</p>
              </div>
              <button className="connect-button">
                <FaUserPlus className="connect-icon" />
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyNetwork;