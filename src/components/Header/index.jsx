import React, { useState,useEffect  } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import Cookies from 'js-cookie';  
import './index.css';
import {FiLogOut } from 'react-icons/fi';

const Header = (props) => {
  
  
  const homeLogout=()=>{
    Cookies.remove('jwt_token');
    window.location.href = '/';
  }


  return (
    <>
      <div className="navbar">
        <div className="navbarL">
          <h1 className="head">ACHYVTA</h1>
        </div>

        <div className="navbarR">
            <Link to="/Home" className="button">Home</Link>
            <Link to="/Jobs" className="button">Jobs</Link>
            <Link to="/MyNetworks" className="button">My Network</Link>
            <Link to="/Notifications" className="button">Notifications</Link>
            <Link to="/MyProfile" className="button">
            <img
              src="https://media-hosting.imagekit.io//b66601905e134787/AChyuta.png?Expires=1837053793&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=NUMYiJKUd6n5r0NFviaEYAEeSN2n5km7VB1~qQppAyi~zOJpDZDsOpLcdlBlaD6fskIsbn-rFdI3JPUJoR8lfggtUtum2bn~B2iwkU~YHmvCURnna34ZCRG8D7zv3LKIj7rzYvw4e7eo272AbZA198~k2qqgtxPE5HzGtiUibgKQSwqxm~-~DqHxLP1EcshWKnu0qUgPNh-1UPHKmm~whGoviFpBFRjjJLdKjYxNBTtdIrZmtHs-2J2KeM8Sffwy-JuDc6FUT7YW1Qo3wEja3gjzeb69GW89MeAt2ZNTRYYDeixb5kPgx~Hez-nPpSFKqDnquO6ebmQdbzMZ4xuzrA__"
              alt="icon"
              className="imageicon"
            />
            </Link>
            
        </div>
      </div>
    </>
  );
};


export default Header;
