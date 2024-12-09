import styles from "./LoggedInHeader.module.css";
import { logout, getUser } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAccessRightStore } from "@/store/accessRight";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getUserProps } from "@/types/apiTypes";

const LoggedInHeader = () => {
  const params = useParams();
  let isFixed = false;
  let isInClassroomDashboarclassroomdUrl = false;
  const queryClient = useQueryClient();
  const isHost = useAccessRightStore((state) => state.isHost);
  const classroomId = Number(params.classroomId);
  const { data: userData } = useQuery<getUserProps>({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 1000 * 60,
    retry: 3,
  });

  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") {
    isFixed = true;
  }
  if (/\/classroomdashboard\/classroom(\/.*)?$/.test(location.pathname)) {
    isInClassroomDashboarclassroomdUrl = true;
  }

  // 로그아웃 mutation
  const logoutMuation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      // 로그아웃 시 user 쿼리 캐시를 null로 설정
      await queryClient.invalidateQueries();
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleLogout = () => {
    logoutMuation.mutate();
  };

  return (
    <header className={styles["bg-blue"]} style={{ position: isFixed ? "fixed" : "static" }}>
      <div className={styles["header-menu"]}>
        <Link className={styles["header-logo"]} to="/">
          <img src="/image/img_logo.png" alt="로고" />
        </Link>
        {(userData && userData?.code !== "CM-200000") || userData?.code === undefined ? (
          <></>
        ) : (
          <>
            {isInClassroomDashboarclassroomdUrl ? (
              <>
                <NavLink
                  to="/classroomdashboard"
                  end
                  className={({ isActive }) => (isActive ? styles["on_active"] : "")}
                >
                  클래스룸
                </NavLink>
                <NavLink
                  to={`/classroomdashboard/classroom/viz/${classroomId}`}
                  className={({ isActive }) => (isActive ? styles["on_active"] : "")}
                >
                  시각화
                </NavLink>
                {isHost && (
                  <NavLink
                    to={`/classroomdashboard/classroom/${classroomId}`}
                    end
                    className={({ isActive }) => (isActive ? styles["on_active"] : "")}
                  >
                    진척도
                  </NavLink>
                )}

                {isHost && (
                  <NavLink
                    to={`/classroomdashboard/classroom/manage/${classroomId}`}
                    className={({ isActive }) => (isActive ? styles["on_active"] : "")}
                  >
                    설정
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink to="/classroomdashboard" className={({ isActive }) => (isActive ? styles["on_active"] : "")}>
                  클래스룸
                </NavLink>
              </>
            )}
          </>
        )}
      </div>

      <div className="login-header">
        {userData?.code !== "CM-200000" ? (
          <div>
            <Link to="/login" className={styles["login-btn"]}>
              로그인
            </Link>
            <Link to="/signup" className={styles["join-btn"]}>
              회원가입
            </Link>
          </div>
        ) : (
          <>
            <p style={{ marginRight: "10px" }}>{userData.result?.name}님</p>
            <p onClick={handleLogout} className={styles["logout"]}>
              로그아웃
            </p>
          </>
        )}
      </div>
    </header>
  );
};
export default LoggedInHeader;
