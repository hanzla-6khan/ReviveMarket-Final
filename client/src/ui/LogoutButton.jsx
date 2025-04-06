import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";

const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };

  return (
    <IconButton onClick={handleLogout}>
      <LogoutOutlined />
    </IconButton>
  );
};

export default LogoutButton;
