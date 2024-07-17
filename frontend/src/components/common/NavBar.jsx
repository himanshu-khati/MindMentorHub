import { BsChevronDown } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { BiCart } from "react-icons/bi";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NAVBAR_LINKS, ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/auth/ProfileDropdown";
import useFetchAllCourses from "../../hooks/useFetchAllCourses";

const NavBar = () => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [subLinks, setSubLinks] = useState([]);
  const { courses, error, loading } = useFetchAllCourses();

  useEffect(() => {
    if (!loading && !error) {
      setSubLinks(courses);
    }
  }, [courses, error, loading]);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  const renderSubLinks = () => {
    if (loading) {
      return <p className="text-center">Loading...</p>;
    }

    if (subLinks.length === 0) {
      return <p className="text-center">No Courses Found</p>;
    }
    return subLinks.map((subLink) => (
      <Link
        key={subLink._id}
        to={`/catalog/${subLink.courseName.split(" ").join("-").toLowerCase()}`}
        className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
      >
        <p>{subLink.courseName}</p>
      </Link>
    ));
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="w-11/12 flex max-w-maxContent items-center justify-between">
        <Link to="/">
          <img src={logo} width={160} height={42} loading="lazy" alt="Logo" />
        </Link>
        <nav className="hidden md:block">
          <ul className="flex gap-6 text-richblack-25">
            {NAVBAR_LINKS.map((link) => (
              <li key={link.title}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {renderSubLinks()}
                    </div>
                  </div>
                ) : (
                  <Link to={link.path}>
                    <p
                      className={`${
                        matchRoute(link.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user.accountType !== ACCOUNT_TYPE.instructor && (
            <Link to="/dashboard/cart" className="relative">
              <BiCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null ? (
            <>
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <ProfileDropdown />
          )}
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  );
};

export default NavBar;
