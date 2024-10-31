import styles from "./LoggedInHeader.module.css";
import { useUserStore } from "@/store/user";
import { logout, getUser } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { User } from "@/App";
const LoggedInHeader = () => {
  // const userName = useUserStore((state) => state.userName);
  // const resetUser = useUserStore((state) => state.resetUser);
  const userData = useQuery<User>({ queryKey: ["user"], queryFn: getUser, staleTime: 1000 * 60 });
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      logout();

      // resetUser();
      navigate("/");
    } catch {
      console.error("로그아웃 에러");
    }
  };
  return (
    <header className={styles["bg-blue"]}>
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
