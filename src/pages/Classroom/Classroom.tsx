import { useState, useCallback, useEffect } from "react";
import Guest from "./components/Guest";
import { useMswReadyStore } from "@/store/mswReady";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAccessRightStore } from "@/store/accessRight";
import { useCustomAlert } from "@/pages/components/CustomAlert";
import {
  getClassGuestDataWithoutDefaultAction,
  getTotalActionInfo,
  ClassEnd,
  getClassAccessRightData,
} from "@/services/api";
import Header from "../components/Header";

import ClassroomModal from "@/pages/Classroom/components/ClassroomModal.tsx";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export interface GuestType {
  id: number;
  email: string;
  name: string;
  status: number;
  role: number;
}

interface ActionInfoType {
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
    actionInfo: ActionInfoType;
    totalInfo: { ing: number; complete: number; help: number };
  };
}

interface ClassAccessRightDataType {
  isAccess: boolean;
  isHost: boolean;
}

const Classroom = () => {
  const [guests, setGuests] = useState<GuestType[]>();
  const [actionInfo, setActionInfo] = useState<ActionInfoType>();
  const isMswReady = useMswReadyStore((state) => state.isMswReady);
  const navigate = useNavigate();
  const params = useParams();
  const classroomId = Number(params.classroomId);
  const setIsHost = useAccessRightStore((state) => state.setIsHost);
  const [isConsentInformationModalOpen, setIsConsentInformationModalOpen] = useState<boolean>(false);
  const [onClickGuest, setOnClickGuest] = useState<GuestType | null>(null);
  const { data: guestData, refetch: guestDataRefetch } = useQuery<ClassroomDataType>({
    queryKey: ["classGuestData", classroomId],
    queryFn: () => getClassGuestDataWithoutDefaultAction(classroomId),
    enabled: isMswReady,
  });
  const { data: classroomData, refetch: classroomDataRefetch } = useQuery<TotalActionInfoType>({
    queryKey: ["totalActionInfo", classroomId],
    queryFn: () => getTotalActionInfo(classroomId),
    enabled: isMswReady,
  });

  const { data: classAccessRightData, isSuccess } = useQuery<ClassAccessRightDataType>({
    queryKey: ["classAccessRightData", classroomId],
    queryFn: () => getClassAccessRightData(classroomId),
    enabled: isMswReady,
    staleTime: 1000 * 60,
  });
  useEffect(() => {
    if (isSuccess) {
      setIsHost(classAccessRightData.isHost);
      if (!classAccessRightData?.isAccess) {
        navigate("/");
      }
    }
  }, [classAccessRightData, isSuccess]);

  useEffect(() => {
    if (guestData) {
      setGuests(guestData.result.guests);
    }
  }, [guestData]);

  useEffect(() => {
    if (classroomData) {
      setActionInfo(classroomData.result.totalInfo);
    }
  }, [classroomData]);

  const { openAlert, CustomAlert } = useCustomAlert();

  const classOverMutation = useMutation({
    mutationFn: ClassEnd,
    onSuccess: () => {
      classroomDataRefetch();
      navigate("/classroomdashboard");
    },
    onError: () => {
      openAlert("정상적으로 수업이 종료되지 않았습니다");
    },
  });

  const handleClassOver = () => {
    classOverMutation.mutate(classroomId);
  };

  const useSSE = (url: string) => {
    const [data, setData] = useState<unknown>(null);
    const queryClient = useQueryClient();

    const subscribe = useCallback(() => {
      const eventSource = new EventSource(url, { withCredentials: true });

      eventSource.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          setData(newData);
          queryClient.setQueryData(["sse-data"], newData);
          guestDataRefetch();
          classroomDataRefetch();
        } catch (error) {
          console.error("Failed to parse SSE message:", error);
        }
      };

      eventSource.addEventListener("action", (event) => {
        try {
          const newData = JSON.parse(event.data);
          setData(newData);
          queryClient.setQueryData(["sse-data", classroomId], newData);
          guestDataRefetch();
          classroomDataRefetch();
        } catch (error) {
          console.error("Failed to parse SSE action event:", error);
        }
      });

      eventSource.addEventListener("error", (error) => {
        console.error("SSE connection error:", error);
      });

      return () => {
        eventSource.close();
      };
    }, [url, queryClient, classroomId, guestDataRefetch, classroomDataRefetch]);

    useEffect(() => {
      const unsubscribe = subscribe();
      return unsubscribe;
    }, [subscribe]);

    return { data };
  };

  useSSE(`${BASE_URL}/edupi-lms/v1/progress/connect?classroomId=${classroomId}`);
  const closeConsentInformationModal = (): void => {
    setIsConsentInformationModalOpen(false);
  };
  const openConsentInformationModal = (guest: GuestType): void => {
    if (guest.status === 1) return;
    setIsConsentInformationModalOpen(true);
    setOnClickGuest(guest);
  };

  return (
    <>
      <div>
        <Header />
        <CustomAlert />
        <ClassroomModal
          isOpen={isConsentInformationModalOpen}
          onClose={closeConsentInformationModal}
          guest={onClickGuest!}
        />
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
                    <p>{actionInfo && actionInfo?.ing + actionInfo?.complete + actionInfo?.help}</p>
                  </div>
                </li>
                <li>
                  <img src="/image/progress02.svg" alt="미제출" />
                  <div>
                    <p>미제출</p>
                    <p>{actionInfo?.ing}</p>
                  </div>
                </li>
                <li>
                  <img src="/image/progress03.svg" alt="성공" />
                  <div>
                    <p>제출 완료</p>
                    <p>{actionInfo?.complete}</p>
                  </div>
                </li>
                <li>
                  <img src="/image/progress04.svg" alt="실패" />
                  <div>
                    <p>도움 요청</p>
                    <p>{actionInfo?.help}</p>
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
          </div>
          {guests && guests.length > 0 ? (
            <ul className="section-data section-data01">
              {guests.map((guest) => (
                <Guest key={guest.id} guest={guest} onClick={() => openConsentInformationModal(guest)} />
              ))}
            </ul>
          ) : (
            <div className="section-empty-progress">
              <img src="/image/img_empty_progress.png" alt="empty guests" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Classroom;
