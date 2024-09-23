import axios from "axios";
import { User, LoginUser } from "../types/apiTypes";
export const fetchUser = async (): Promise<User> => {
  const response = await fetch("http://localhost:8080/edupi_user/v1/member/login/info", {
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
  axios.post("http://localhost:8080/edupi_user/v1/member/login", req, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });