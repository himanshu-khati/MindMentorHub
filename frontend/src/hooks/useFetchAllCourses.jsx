import { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { courseEndpoints } from "../services/apis";

const useFetchAllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const result = await apiConnector(
          "GET",
          courseEndpoints.GET_ALL_COURSES
        );
        setCourses(result?.data?.data);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  return { courses, loading, error };
};

export default useFetchAllCourses;
