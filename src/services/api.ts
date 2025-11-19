import axios from "axios";
import {
  getUserProps,
  LoginProps,
  SignupProps,
  inviteClassroomProps,
  GptCorrectResponse,
  GptHintResponse,
} from "../types/apiTypes";
interface codeInputProps {
  code: string;
  inputData: string;
}
const BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export const visualize = async ({ code, inputData }: codeInputProps) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-assist/v1/execute/visualize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source_code: code, input: inputData }),
    });
    if (!response.ok) {
      throw await response.json();
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const runCode = async ({ code, inputData }: codeInputProps) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-assist/v1/execute/code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source_code: code, input: inputData }),
    });
    if (!response.ok) {
      throw await response.json();
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getUser = async (): Promise<getUserProps> => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-user/v1/account/login/info`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw await response.json();
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network or fetch error:", error);
    throw error;
  }
};

export const login = (req: LoginProps) =>
  axios.post(`${BASE_URL}/edupi-user/v1/account/login`, req, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

export const signup = (req: SignupProps) =>
  axios.post(`${BASE_URL}/edupi-user/v1/account/signup`, req, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
export const getHostGuestData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-lms/v1/classroom`, {
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
    console.error(error);
    throw error;
  }
};
export const inviteClassroom = async ({ classroomId, guestEmail }: inviteClassroomProps) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-lms/v1/classroom/account`, {
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
      throw await response.json();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getGuestStatus = async (classroomId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-lms/v1/guest/action/status?classroomId=${classroomId}`, {
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
    console.error(error);
    throw error;
  }
};
export const createClass = async (createClassName: string) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-lms/v1/classroom`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: createClassName }),
    });
    if (!response.ok) {
      // response.ok가 false이면 (상태 코드가 200-299 범위 밖이면) 에러를 throw합니다.

      throw await response.json();
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getClassGuestData = async (classroomId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-lms/v1/classroom/account?classroomId=${classroomId}`, {
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
    console.error(error);
    throw error;
  }
};
export const getClassGuestDataWithoutDefaultAction = async (classroomId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-lms/v1/classroom/account/progress?classroomId=${classroomId}`, {
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
    console.error(error);
    throw error;
  }
};
export const getClassAccessRightData = async (classroomId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-lms/v1/classroom/account/role?classroomId=${classroomId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getTotalActionInfo = async (classroomId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-lms/v1/classroom/info?classroomId=${classroomId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    interface ActionInfoItem {
      name: string;
      count: number;
    }
    const actionInfo = data.result.totalActionInfo as ActionInfoItem[];
    let ing = actionInfo.find((item) => item.name === "ING")?.count;
    if (!ing) {
      ing = 0;
    }
    let complete = actionInfo.find((item) => item.name === "COMPLETE")?.count;
    if (!complete) {
      complete = 0;
    }
    let help = actionInfo.find((item) => item.name === "HELP")?.count;
    if (!help) {
      help = 0;
    }
    data.result.totalInfo = { ing, complete, help };
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteClassroom = async (classroomId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-lms/v1/classroom?classroomId=${classroomId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const ClassEnd = async (classroomId: number) => {
  const response = await fetch(`${BASE_URL}/edupi-lms/v1/classroom/action/init`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ classroomId: classroomId }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

interface FetchGuestActionRequestParams {
  classroomId: number;
  action: string;
  code: string;
}

export const fetchGuestActionRequest = async (req: FetchGuestActionRequestParams) => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-lms/v1/progress/send`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classroomId: req.classroomId,
        action: req.action,
        code: req.code,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const emissionGuest = async (classroomAccountId: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/edupi-lms/v1/classroom/account?classroomAccountId=${classroomAccountId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async (): Promise<null> => {
  try {
    const response = await fetch(`${BASE_URL}/edupi-user/v1/account/logout`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchGptCorrect = async (code: string, lineNumber: number): Promise<GptCorrectResponse> => {
  const response = await fetch(`${BASE_URL}/edupi-assist/v1/advice/correction`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ line: lineNumber, source_code: code }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
export const fetchGptHint = async (code: string, lineNumber: number): Promise<GptHintResponse> => {
  const response = await fetch(`${BASE_URL}/edupi-assist/v1/advice/hint`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ line: lineNumber, source_code: code }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const getStudentCode = async (classroomAccountId: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/edupi-lms/v1/classroom/account/code?classroomAccountId=${classroomAccountId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw await response.json();
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
