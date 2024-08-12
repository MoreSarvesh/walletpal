import { axiosPrivate } from "../api/axios";
import useRefreshttoken from "./useRefreshttoken";
import useAuth from "./useAuth";
import { useEffect } from "react";

const useAxiosPrivate = () => {
  const refresh = useRefreshttoken();
  const { auth } = useAuth();

  useEffect(() => {
    const axiosRequestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.accesstoken}`;
        }

        return config;
      },
      (error) => {
        console.log("axiosPrivate.interceptors.request error:", error);

        return Promise.reject(error);
      }
    );

    //if all good then return response else async error handler for expired token
    const axiosResponseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        //adding custom property sent to determine if we have already retried the request
        if (error?.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true;
          const newAccesstoken = refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccesstoken}`;

          //retry now new request
          return axiosPrivate(prevRequest);
        }

        console.log("axiosResponseIntercept Error: ", error);
        return Promise.reject(error);
      }
    );

    //console.log("AxiosPrivateRequestIntercept: ", axiosRequestIntercept);
    //console.log("AxiosResponseIntercept: ", axiosResponseIntercept);

    //cleanup function for removing interceptors
    return () => {
      axiosPrivate.interceptors.request.eject(axiosRequestIntercept);
      axiosPrivate.interceptors.response.eject(axiosResponseIntercept);
    };
  }, [auth, refresh]);

  //console.log("axiosPrivate: ", axiosPrivate);

  return axiosPrivate; //private axios instance with interceptors attached
};

export default useAxiosPrivate;
