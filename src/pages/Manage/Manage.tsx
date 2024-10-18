import LoggedInClassroomHeader from "@/pages/components/LoggedInClassroomHeader";
import Guest from "./components/Guest";
import { useMswReadyStore } from "@/store/mswReady";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { getClassGuestData, fetchDeleteClassroom, getTotalActionInfo } from "@/services/api";
interface GuestType {
  id: number;
  email: string;
  name: string;
  status: number;
}
interface TotalInfoType {
  ing: number;
  complete: number;
  help: number;
}

interface ClassroomData {
  result: {
    guests: GuestType[];
  };
}
interface GetClassTotalActionInfoType {
  result: {
    className: string;
    totalInfo: TotalInfoType;
  };
}
interface props {
  classroomId: number;
  guestEmail: string;
}
const Modify = () => {
  const params = useParams();
  const classroomId = Number(params.classroomId);
  const [guests, setGuests] = useState<GuestType[]>();
  const [guestEmail, setGuestEmail] = useState<string | undefined>();
  const isMswReady = useMswReadyStore((state) => state.isMswReady);
  const navigate = useNavigate();
  const inviteClassroom = async ({ classroomId, guestEmail }: props) => {
    try {
      const response = await fetch(`http://localhost:8080/edupi-lms/v1/classroom/account`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classroomId: classroomId,
          email: guestEmail,
          role: 2,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("An error occurred:", error);
      throw error;
    }
  };
  const { data: classroomData, refetch: classroomDataRefetch } = useQuery<GetClassTotalActionInfoType>({
    queryKey: ["ClassTotalActionInfo", classroomId],
    queryFn: () => getTotalActionInfo(classroomId),
    enabled: isMswReady,
  });

  const { data, refetch: getClassroomRefetch } = useQuery<ClassroomData>({
    queryKey: ["classroomData", classroomId],
    queryFn: () => getClassGuestData(classroomId),
    enabled: isMswReady,
  });
  const changeGuestEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setGuestEmail(e.target.value);
  };
  const submitInviteGuest = () => {
    if (guestEmail) {
      mutation.mutate({ classroomId, guestEmail });
    } else {
      console.error("클래스 이름을 입력하세요");
    }
  };
  const mutation = useMutation({
    mutationFn: inviteClassroom,
    async onSuccess() {
      getClassroomRefetch();
      classroomDataRefetch();
    },
    onError(error) {
      console.error("클래스룸 초대 에러", error);
    },
  });

  useEffect(() => {
    if (data) {
      setGuests(data.result.guests);
    }
  }, [data]);

  const deleteClassroomMutation = useMutation({
    mutationFn: fetchDeleteClassroom,
    onSuccess: () => {
      alert("클래스룸이 삭제되었습니다.");
      navigate("/classroomspace");
    },
    onError: (error) => {
      console.error("An error occurred:", error);
      alert("클래스룸 삭제에 실패했습니다.");
    },
  });

  const handleDeleteClassroom = () => {
    deleteClassroomMutation.mutate(classroomId);
  };
  return (
    <div className="bg">
      <LoggedInClassroomHeader />
      <div id="header02" className="bg-blue"></div>
      <div className="group-wrap">
        <div className="group-left">
          <img src="/image/icon_group.svg" alt="그룹" />
          <h2 className="group-title">{classroomData?.result.className}</h2>
        </div>
        <div className="group-link">
          <p className="link-name">클래스룸 초대</p>
          <div className="invite-wrap">
            <input className="invite-input" value={guestEmail} onChange={changeGuestEmail}></input>
            <button className="invite-button" onClick={submitInviteGuest}>
              <p>초대하기</p>
            </button>
          </div>
        </div>
      </div>
      <div className="s__container">
        <div className="modify-s__row">
          <div className="section-title">
            <div className="title-left">
              <h3>가입된 학생</h3>
            </div>
            <div className="title-right">
              <div className="search-wrap">
                <input type="text" placeholder=" 학생 검색" />
                <button>
                  <img src="/image/icon_search.svg" alt="검색" />
                </button>
              </div>
            </div>
          </div>
          <ul className="section-data section-data03">
            {guests?.map((guest) => (
              <Guest key={guest.id} guest={guest} getClassroomRefetch={getClassroomRefetch} />
            ))}
          </ul>
          <div className="right-btns">
            <button className="red" onClick={handleDeleteClassroom}>
              <img src="/image/icon_delete.svg" alt="그룹삭제" />
              클래스룸 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modify;
