import axios from "axios";
import { User, LoginUser } from "../types/apiTypes";
export const fetchUser = async (): Promise<User> => {
  const response = await fetch("http://localhost:8080/edupi-user/v1/account/login/info", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};
export const login = (req: LoginUser) =>
  axios.post("http://localhost:8080/edupi-user/v1/account/login", req, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

export const getHostGuestData = async (classroomId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/edupi-lms/v1/classroom?classroomId=${classroomId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
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

export const createClass = async (createClassName: string) => {
  const response = await fetch("http://localhost:8080/edupi-lms/v1/classroom", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: createClassName }),
  });
  if (!response.ok) {
    // response.ok가 false이면 (상태 코드가 200-299 범위 밖이면) 에러를 throw합니다.
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getClassGuestData = async (classroomId: number) => {
  try {
    const response = await fetch(
      `http://localhost:8080/edupi-lms/v1/classroom/account/progress?classroomId=${classroomId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

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

export const getClassTotalActionInfo = async (classroomId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/edupi-lms/v1/classroom/info?classroomId=${classroomId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    let ing = data.result.totalActionInfo.find((item: any) => item.name === "ING")?.count;
    if (!ing) {
      ing = 0;
    }
    let complete = data.result.totalActionInfo.find((item: any) => item.name === "COMPLETE")?.count;
    if (!complete) {
      complete = 0;
    }
    let help = data.result.totalActionInfo.find((item: any) => item.name === "HELP")?.count;
    if (!help) {
      help = 0;
    }
    data.result.totalInfo = { ing, complete, help };
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
