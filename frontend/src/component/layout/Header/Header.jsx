import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from "../../../service";
import { HeaderContext } from "../../../contexts/HeaderContext";

const Header = () => {
  const navigate = useNavigate();
  const { headerText } = useContext(HeaderContext);

  const handleLogout = () => {
    navigate("/login", { replace: true });
    logout();
  };

  return (
    <header style={{
      border: '1px solid #d2d2d2',
      borderRadius: '4px',
      padding: '0 24px',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,21,41,.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px'
    }}>
      <h1 style={{ margin: 0, fontSize: '40px' }}>{headerText}</h1>
      <Button
        style={{ background: '#4e73df' }}
        onClick={handleLogout}
        icon={<LogoutOutlined />}
        type="primary"
      >
        Logout
      </Button>
    </header>
  );
};

export default Header;