import { fetchLogout } from "@/services/api";
import styles from "./LoggedInHeader.module.css";
import { useUserStore } from "@/store/user";

import { Link, NavLink, useNavigate, useParams } from "react-router-dom";

const LoggedInClassroomHeader = () => {
  const params = useParams();
  const resetUser = useUserStore((state) => state.resetUser);
  const userName = useUserStore((state) => state.userName);
  const navigate = useNavigate();
  const logout = async () => {
    try {
      fetchLogout();
      resetUser();
      navigate("/");
    } catch {
      console.error("로그아웃 에러");
    }
  };
  const classroomId = params.classroomId;
  return (
    <header className={styles["bg-blue"]}>
      <div className={styles["header-menu"]}>
        <Link className={styles["header-logo"]} to="/">
          <img src="/image/img_logo.png" alt="로고" />
        </Link>
        {/* <!-- 활성화 할 a태그에 on_active 클래스 추가 --> */}
        <NavLink
          to={`/classroomspace/classroom/${classroomId}`}
          end
          className={({ isActive }) => (isActive ? styles["on_active"] : "")}
        >
          진척도
        </NavLink>

        <NavLink
          to={`/classroomspace/classroom/viz/${classroomId}`}
          className={({ isActive }) => (isActive ? styles["on_active"] : "")}
        >
          시각화
        </NavLink>

        <NavLink
          to={`/classroomspace/classroom/manage/${classroomId}`}
          className={({ isActive }) => (isActive ? styles["on_active"] : "")}
        >
          설정
        </NavLink>
      </div>

      <div>
        <NavLink
          to={`/classroomspace`}
          end
          className={({ isActive }) => (isActive ? styles["on_active"] : "")}
          style={{ marginRight: "10px" }}
        >
          <button className="nav-button">
            <span>나가기</span>
          </button>
        </NavLink>
        <button
          onClick={logout}
          className={styles["logout"] + " nav-button"}
          style={{ marginRight: "10px", color: "gray" }}
        >
          <span>로그아웃</span>
        </button>
        {userName === "" ? null : <span>{userName}님</span>}
      </div>
    </header>
  );
};
export default LoggedInClassroomHeader;
