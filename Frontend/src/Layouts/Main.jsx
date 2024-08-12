//helper function
import { Navigate, Outlet } from "react-router-dom";

//assests
import wave from "../assets/wave.svg";

//components
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import DataProvider from "../context/DataProvider";
import { useEffect, useState } from "react";
import useRefreshttoken from "../hooks/useRefreshttoken";

//component
const Main = () => {
  const { auth } = useAuth();
  const refresh = useRefreshttoken();
  const [isLoading, setIsLoading] = useState(true);
  //console.log(auth.username);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      setIsLoading(true);
      try {
        await refresh();
      } catch (error) {
        console.log("verifyRefreshToken error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!auth.accesstoken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("loading state: ", isLoading);
    console.log("auth: ", auth);
  }, [isLoading]);

  return (
    <>
      {!isLoading ? (
        auth?.username ? (
          <div className="layout">
            <Navbar userName={auth.username} />
            <DataProvider>
              <Outlet />
            </DataProvider>
            <img src={wave} alt="" />
          </div>
        ) : (
          <Navigate to="/" replace />
        )
      ) : (
        <div>Loading..</div>
      )}
    </>
  );
};

export default Main;
