import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";

const useUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        dispatch(setUser({ user, token }));
      }
    }
  }, [dispatch]);
};

export default useUser;
