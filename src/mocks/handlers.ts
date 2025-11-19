import { http, HttpResponse, delay } from "msw";
import * as jose from "jose";
// import testResponseBody from "./samples/testResponseBody";
import forLoopResponseBody from "./samples/forLoopResponseBody";

const JWT_SECRET = new TextEncoder().encode("your_jwt_secret_key");

async function generateToken(userId: string) {
  const jwt = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SECRET);

  return jwt;
}

interface User {
  email: string;
  password: string;
}

interface SignupUser {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const handlers = [
  http.post("*/edupi-assist/v1/execute/visualize", () => {
    return HttpResponse.json(
      {
        code: "CA-200000",
        detail: "success code analysis",
        result: {
          code: forLoopResponseBody,
        },
      },
      {
        status: 200,
      }
    );
  }),

  // 기존 테스트 응답 (주석 처리 - 필요시 활성화)
  // http.post("http://localhost:8080/edupi-assist/v1/execute/visualize", () => {
  //   return HttpResponse.json(
  //     {
  //       success: true,
  //       code: "CS-200000",
  //       detail: "success code analysis",
  //       result: { code: testResponseBody },
  //     },
  //     {
  //       status: 200,
  //     }
  //   );
  // }),

  // 시각화 요청 실패
  // http.post("http://localhost:8080/edupi-assist/v1/execute/visualize", async () => {
  //   return HttpResponse.json(
  //     {
  //       success: false,
  //       code: "CS_400001",
  //       detail: "코드 문법 오류입니다",
  //       result: {
  //         error: "3:7: F821 undefined name 'a'",
  //       },
  //     },
  //     {
  //       status: 400,
  //     }
  //   );
  // }),
  http.get("/edupi-user/v1/account/login/info", async () => {
    // Get the token from the cookies

    // 쿠키에서 토큰을 확인
    // const cookies = request.headers.get("Cookie");
    // const hasToken = cookies && cookies.includes("token=");
    const hasToken = true;
    if (hasToken) {
      return HttpResponse.json(
        {
          success: true,
          email: "test@test.com",
          name: "테스트 사용자",
          role: "2",
        },
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    } else {
      return HttpResponse.json(
        {
          success: false,
          message: "인증되지 않은 사용자",
        },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }
  }),

  http.post("/edupi-user/v1/account/login", async ({ request }) => {
    try {
      const { email, password } = (await request.json()) as User;

      if (email === "test@test.com" && password === "test") {
        // JWT 토큰 생성을 기다립니다.
        const token = await generateToken(email);

        const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);

        return HttpResponse.json(
          {
            success: true,
            message: "로그인 성공",
          },
          {
            status: 200,
            headers: {
              "Set-Cookie": `token=${token}; Secure;SameSite=Strict; Expires=${expirationDate.toUTCString()}`,
            },
          }
        );
      } else {
        return HttpResponse.json(
          {
            success: false,
            message: "아이디 또는 비밀번호가 잘못되었습니다",
          },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      return HttpResponse.json(
        {
          success: false,
          message: "서버 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }
  }),

  http.post("/edupi-user/v1/account/signup", async ({ request }) => {
    const { username } = (await request.json()) as SignupUser;
    if (username === "error") return HttpResponse.json({ success: false, message: "회원가입 실패" }, { status: 500 });
    return HttpResponse.json(
      {
        success: true,
        message: "회원가입 성공",
      },
      { status: 200 }
    );
  }),

  http.get("http://localhost:8080/edupi-lms/v1/classroom", () => {
    return HttpResponse.json(
      {
        success: true,
        code: "CM-200000",
        detail: "Success retrieved my classrooms",
        result: {
          hosts: [
            {
              id: 6,
              name: "classroom2",
              role: "HOST",
              totalPeople: 1,
            },
            {
              id: 7,
              name: "classroom3",
              role: "HOST",
              totalPeople: 1,
            },
            {
              id: 8,
              name: "classroom3",
              role: "HOST",
              totalPeople: 1,
            },
          ],
          guests: [
            {
              id: 1,
              name: "classroom1",
              role: "GUEST",
              totalPeople: 1,
            },
            {
              id: 2,
              name: "classroom4",
              role: "GUEST",
              totalPeople: 1,
            },
            {
              id: 3,
              name: "classroom4",
              role: "GUEST",
              totalPeople: 1,
            },
            {
              id: 4,
              name: "classroom4",
              role: "GUEST",
              totalPeople: 1,
            },
          ],
        },
      },
      { status: 200 }
    );
  }),

  http.get("http://localhost:8080/edupi-lms/v1/classroom/account", () => {
    return HttpResponse.json({
      success: true,
      result: {
        guests: [
          {
            id: 1,
            name: "김민수",
            email: "i1004gy.naver.com",
            status: 1,
          },
          {
            id: 2,
            name: "박철수",
            email: "i1004gy.naver.com",
            status: 1,
          },
          {
            id: 3,
            name: "신지연",
            email: "i1004gy.naver.com",
            status: 1,
          },
        ],
      },
    });
  }),

  http.get("http://localhost:8080/edupi-lms/v1/classroom/info", () => {
    return HttpResponse.json({
      success: true,
      result: {
        className: "classroom1",
        totalActionInfo: [
          {
            name: "ING",
            count: 3,
          },
          {
            name: "HELP",
            count: 1,
          },
          {
            name: "COMPLETE",
            count: 1,
          },
        ],
      },
    });
  }),
  http.post("http://localhost:8080/edupi-lms/v1/classroom/account", async () => {
    return HttpResponse.json({
      code: "CM-200000",
      detail: "success create classroom account",
      result: {
        id: 19,
        email: "test2@naver.com",
        name: "학습자2",
        status: 0,
        role: 2,
      },
    });
  }),

  http.post("http://localhost:8080/edupi-lms/v1/progress/send", async () => {
    return HttpResponse.json({
      code: "CM-200000",
      detail: "액션이 변경되었습니다.",
      result: 1,
    });
  }),
  http.get("http://localhost:8080/edupi-lms/v1/guest/action/status", async () => {
    return HttpResponse.json({
      code: "CM-200000",
      detail: "Success retrieved classroom info",
      result: 1, // 1 : ING, 2 : HELP, 3 : COMPLETE, 0: 올 일 없음
    });
  }),
  http.post("http://localhost:8080/edupi-lms/v1/classroom/action/init", async () => {
    return HttpResponse.json({
      code: "CM-200000",
      detail: "Success update actions in classroom",
      result: 2, // 변경된 상태 수
    });
  }),
  http.post("http://localhost:8080/edupi-syntax/v1/advice/correct", async () => {
    await delay(1000);
    return HttpResponse.json({
      code: "CS-200000",
      detail: "success correct",
      result: {
        reason: "코드에서 반복문을 잘못 작성하여 오류가 발생했습니다. i를 선언하고 반복문을 실행하세요",
        modified_codes: [
          {
            line: 1,
            code: "for i in range(10):for i in range(10):",
          },
          {
            line: 2,
            code: "   print(i)",
          },
          {
            line: 4,
            code: "   print(i)",
          },
          {
            line: 5,
            code: "   print(i)",
          },
        ],
      },
    });
  }),
  http.post("http://localhost:8080/edupi-syntax/v1/advice/hint", async () => {
    return HttpResponse.json({
      code: "CS-200000",
      detail: "success serve hint",
      result: {
        line: 2,
        hint: "a는 선언된 변수가 아닙니다. a를 초기화 해주세요",
      },
    });
  }),
];
