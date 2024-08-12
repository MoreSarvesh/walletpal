import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshttoken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/users/refresh", {
      withCredentials: true,
    });

    console.log("response:", response);

    setAuth((prev) => ({
      ...prev,
      accesstoken: response.data.accessToken,
      username: response.data.username,
    }));
    return response.data.accesstoken;
  };

  return refresh;
};

export default useRefreshttoken;
