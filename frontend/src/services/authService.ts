import api from "../api/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export const login = async (data: LoginRequest) => {
  const formData = new URLSearchParams();

  formData.append("username", data.email);
  formData.append("password", data.password);

  const response = await api.post(
    "/users/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};

export const register = async (data: RegisterRequest) => {
  const response = await api.post("/users/register", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};