import styles from "./LoggedInHeader.module.css";
import { logout, getUser } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { User } from "@/App";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

const LoggedInHeader = () => {
  // const userName = useUserStore((state) => state.userName);
  // const resetUser = useUserStore((state) => state.resetUser);
  const userData = useQuery<User>({ queryKey: ["user"], queryFn: getUser, staleTime: 1000 * 60 });
  const navigate = useNavigate();
  const location = useLocation();
  let isStatic = false;
  if (location.pathname === "/viz" || /\/classroomdashboard\/classroom\/viz\/\d+$/.test(location.pathname)) {
    isStatic = true;
  }
  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.isOauthUser === "true") {
        resetUser();
        window.location.href = `${BASE_URL}/edupi-user/oauth2/authorization/${response.provider}?mode=unlink&redirect_uri=http://localhost:5000`;
      } else {
        resetUser();
        navigate("/");
      }
    } catch {
      console.error("로그아웃 에러");
    }
  };
  return (
    <header className={styles["bg-blue"]} style={{ position: isStatic ? "static" : "fixed" }}>
      <div className={styles["header-menu"]}>
        <Link className={styles["header-logo"]} to="/">
          <img src="/image/img_logo.png" alt="로고" />
        </Link>
        {/* <!-- 활성화 할 a태그에 on_active 클래스 추가 --> */}
        <NavLink to="/classroomdashboard" className={({ isActive }) => (isActive ? styles["on_active"] : "")}>
          클래스룸
        </NavLink>

        <NavLink to="/viz" className={({ isActive }) => (isActive ? styles["on_active"] : "")}>
          시각화
        </NavLink>
      </div>

      <div>
        {!userData.data?.name ? (
          <span>{userData.isFetching ? "로딩중" : ""}</span>
        ) : (
          <span style={{ marginRight: "10px" }}>{userData.data.name}님</span>
        )}
        <span onClick={logout} className={styles["logout"]}>
          <span>로그아웃</span>
        </span>
      </div>
    </header>
  );
};
export default LoggedInHeader;
