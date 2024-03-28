"use client";
import Loading from "@/components/Loading";
import CourseItem from "@/components/course/CourseItem";
import CustomPagination from "@/components/pagination/CustomPagination";
import instructorService from "@/services/instructorService";
import { useLoading } from "@/utils/useCustomHook";
import { useQueryState } from "next-usequerystate";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const InstructorCourses = () => {
  const [page, setPage] = useQueryState("page", { defaultValue: 1 });
  const [limit, setLimit] = useQueryState("limit", { defaultValue: 6 });
  const { isLoading, startLoading, stopLoading } = useLoading(true);
  const { id } = useParams();
  const [data, setData] = useState({});

  const getCourses = (updatePage, loading) => {
    loading && startLoading();
    instructorService
      .getInstructorCourses(id, { page: updatePage, limit })
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading && stopLoading();
      });
  };

  useEffect(() => {
    if (id) {
      getCourses(page, true);
    }
  }, [id]);

  const pageHandler = (selected) => {
    const updatePage = selected + 1;
    setPage(updatePage);
    getCourses(updatePage);
  };
  if (isLoading) {
    return (
      <div className="instructor d-flex justify-content-center loading">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <div className="instructor-courses flex courses-card-items corses-card-items-vertical">
        {data?.results?.length > 0 ? (
          [...data?.results].map((course) => (
            <CourseItem course={course} key={course.id} />
          ))
        ) : (
          <p>কোনো কোর্স খুঁজে পাওয়া যায়নি !</p>
        )}
      </div>
      {data?.totalCount > parseInt(data.limit) && (
        <CustomPagination
          itemsPerPage={limit}
          currentPage={page}
          pageHandler={pageHandler}
          totalCount={data.totalCount || 0}
        />
      )}
    </>
  );
};

export default InstructorCourses;
