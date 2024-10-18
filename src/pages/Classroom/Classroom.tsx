import { useState, useCallback, useEffect } from "react";
import LoggedInClassroomHeader from "@/pages/components/LoggedInClassroomHeader";
import Guest from "./components/Guest";
import { useMswReadyStore } from "@/store/mswReady";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getClassGuestData, getTotalActionInfo, fetchClassOver } from "@/services/api";

interface GuestType {
  id: number;
  email: string;
  name: string;
  status: number;
  role: number;
}
interface TotalInfoType {
  ing: number;
  complete: number;
  help: number;
}

interface ClassroomDataType {
  result: {
    guests: GuestType[];
  };
}
interface TotalActionInfoType {
  result: {
    className: string;
    totalInfo: TotalInfoType;
  };
}
const Classroom = () => {
  const [guests, setGuests] = useState<GuestType[]>();
  const [totalInfo, setTotalInfo] = useState<TotalInfoType>();
  const isMswReady = useMswReadyStore((state) => state.isMswReady);
  const navigate = useNavigate();
  const params = useParams();
  const classroomId = Number(params.classroomId);

  const { data: guestData, refetch: guestDataRefetch } = useQuery<ClassroomDataType>({
    queryKey: ["ClassGuestData", classroomId],
    queryFn: () => getClassGuestData(classroomId),
    enabled: isMswReady,
  });
  const { data: classroomData, refetch: classroomDataRefetch } = useQuery<TotalActionInfoType>({
    queryKey: ["totalActionInfo", classroomId],
    queryFn: () => getTotalActionInfo(classroomId),
    enabled: isMswReady,
  });

  useEffect(() => {
    if (guestData) {
      setGuests(guestData.result.guests);
    }
  }, [guestData]);

  useEffect(() => {
    if (classroomData) {
      setTotalInfo(classroomData.result.totalInfo);
    }
  }, [classroomData]);

  const classOverMutation = useMutation({
    mutationFn: fetchClassOver,
    onSuccess: () => {
      classroomDataRefetch();
      navigate("/classroomspace");
    },
    onError: (error) => {
      console.error("An error occurred:", error);
    },
  });

  const handleClassOver = () => {
    classOverMutation.mutate(classroomId);
  };

  const useSSE = (url: string) => {
    const [data, setData] = useState(null);
    const queryClient = useQueryClient();

    const subscribe = useCallback(() => {
      const eventSource = new EventSource(url, { withCredentials: true });

      eventSource.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        setData(newData);
        // setQueryData로 값 캐싱
        queryClient.setQueryData(["sse-data"], newData);
        guestDataRefetch();
        classroomDataRefetch();
      };
      eventSource.addEventListener("action", (event) => {
        const newData = JSON.parse(event.data);
        setData(newData);
        // setQueryData로 값 캐싱
        queryClient.setQueryData(["sse-data", classroomId], newData);
        console.log("서버로 부터 데이터가 옴");
        guestDataRefetch();
        classroomDataRefetch();
      });
      // connection되면
      eventSource.addEventListener("open", function () {
        console.log("서버로 연결이 됨");
      });

      return () => {
        eventSource.close();
      };
    }, [url, queryClient]);

    // 요청을 끊을 때 일어나는 useEffect
    useEffect(() => {
      const unsubscribe = subscribe();
      return unsubscribe;
    }, [subscribe]);

    return { data };
  };

  useSSE(`http://localhost:8080/edupi-lms/v1/progress/connect?classroomId=${classroomId}`);
  return (
    <div>
      <LoggedInClassroomHeader />
      <div className="group-wrap">
        <div className="group-left">
          <img src="/image/icon_group.svg" alt="그룹" />
          <h2 className="group-title">{classroomData?.result.className}</h2>
        </div>
      </div>
      <div className="s__container">
        <div className="s__row">
          <div className="progress-info">
            <ul className="progress-data">
              <li>
                <img src="/image/progress01.svg" alt="전체" />
                <div>
                  <p>전체</p>
                  <p>{totalInfo && totalInfo?.ing + totalInfo?.complete + totalInfo?.help}</p>
                </div>
              </li>
              <li>
                <img src="/image/progress02.svg" alt="미제출" />
                <div>
                  <p>제출 중</p>
                  <p>{totalInfo?.ing}</p>
                </div>
              </li>
              <li>
                <img src="/image/progress03.svg" alt="성공" />
                <div>
                  <p>제출 완료</p>
                  <p>{totalInfo?.complete}</p>
                </div>
              </li>
              <li>
                <img src="/image/progress04.svg" alt="실패" />
                <div>
                  <p>도움</p>
                  <p>{totalInfo?.help}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="section-title">
            <div className="title-left">
              <h3>제출현황</h3>
            </div>

            <div className="classroom-right">
              <div className="right-btns" style={{ marginRight: "15px" }}>
                <button className="red" onClick={handleClassOver}>
                  <img src="/image/icon_on_off.svg" alt="그룹삭제" />
                  수업 종료
                </button>
              </div>
              <select name="" id="" className="s__select">
                <option value="1">이름순</option>
                <option value="2">제출순</option>
                <option value="3">학번순</option>
              </select>
            </div>
          </div>
          <ul className="section-data section-data01">
            {guests?.map((guest) => (
              <Guest key={guest.id} guest={guest} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Classroom;
