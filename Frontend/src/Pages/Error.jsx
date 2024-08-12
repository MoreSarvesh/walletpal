import { Link, useNavigate, useRouteError } from "react-router-dom";
/* import { HomeIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/soild"; */

const Error = () => {
  const err = useRouteError();
  const navigate = useNavigate();
  return (
    <div className="error">
      <h1>Opps! Something went wrong.</h1>
      <p>{err.message || err.statusText}</p>
      <div className="flex-md">
        <button className="btn btn--dark" onClick={() => navigate(-1)}>
          {/* <ArrowUturnLeftIcon width={20} /> */}
          <span>Go Back</span>
        </button>
        <Link to="/" className="btn btn--dark">
          {/* <HomeIcon width={20} /> */}
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
};

export default Error;
