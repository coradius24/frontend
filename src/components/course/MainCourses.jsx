"use client";
import CourseItem from "@/components/course/CourseItem";
import { getQueryString } from "@/utils/lib";
import { useFetch } from "@/utils/useCustomHook";
import { useQueryState } from "next-usequerystate";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import "./mainCourses.css";

const MainCourses = ({ courseResult, categories, contentType = "" }) => {
  const [courses, setCourses] = useState(() => ({
    data: courseResult.results,
    isServer: true,
  }));

  const [filterOptions] = useState(() => ({
    filterRatings: ["all", 1, 2, 3, 4, 5],
    filterPrice: ["all", "free", "paid"],
    filterCourseType: [
      { label: "লাইভ কোর্স", value: "live" },
      { label: "রেকর্ডেড কোর্স", value: "recorded" },
      { label: "সব কোর্স ", value: "all" },
    ],
    filterLevel: ["beginner", "intermediate", "advanced"],
  }));
  const [price, setPrice] = useQueryState("price", { defaultValue: "all" });
  const [page, setPage] = useQueryState("page", { defaultValue: 1 });
  const [level, setLevel] = useQueryState("level");
  const [search, setSearch] = useQueryState("search");
  const [courseType, setCourseType] = useQueryState("contentType", {
    defaultValue: contentType,
  });
  const [selectedCategories, setSelectedCategories] = useQueryState(
    "category",
    { defaultValue: "all" }
  );
  const { data, loading, error, setUrl } = useFetch(null);

  useEffect(() => {
    const searchParams = {
      category: selectedCategories || "all",
    };
    if (courseType) {
      searchParams["contentType"] = courseType;
    }
    if (level) {
      searchParams["level"] = level;
    }
    if (search) {
      searchParams["search"] = search;
    }
    if (price) {
      searchParams["price"] = price;
    }
    if (page) {
      searchParams["page"] = page;
    }
    let queryString = getQueryString(searchParams);
    setUrl(`/api/courses?${queryString}`);
    data && setCourses({ data: data.results, isServer: false });
  }, [
    level,
    courseType,
    selectedCategories,
    search,
    price,
    page,
    setUrl,
    data,
  ]);

  const { filterLevel, filterPrice, filterCourseType } = filterOptions;
  return (
    <div className="container">
      <div className="flex">
        <div className="filter-area">
          <div className="card">
            <div className="card-body p-0">
              {" "}
              <div className="filter_type">
                <div className="form-group">
                  <h3 className="filter-title">কোর্সের ধরণ</h3>
                  <ul>
                    {filterCourseType.map((item) => (
                      <li key={`filterPrice_${item.value}`}>
                        <div>
                          <input
                            type="radio"
                            id={`courseType_${item.value}`}
                            name="courseType"
                            className="prices custom-radio"
                            value={item.value}
                            onChange={() => setCourseType(item.value)}
                            checked={courseType === item.value}
                          />
                          <label
                            htmlFor={`courseType_${item.value}`}
                            className="text-capitalize cursor-pointer"
                          >
                            {item.label}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="filter_type filter_type-category">
                <h3 className="filter-title">কোর্স ক্যাটাগরি</h3>
                <ul>
                  <li>
                    <div className="d-flex">
                      <input
                        onChange={() => setSelectedCategories("all")}
                        checked={selectedCategories === "all"}
                        type="radio"
                        id="category_all"
                        name="sub_category"
                        className="categories custom-radio"
                        value={"all"}
                      />
                      <label
                        className="cursor-pointer text-capitalize"
                        htmlFor="category_all"
                      >
                        All category
                      </label>
                    </div>
                  </li>
                  {categories &&
                    categories.map((category) => (
                      <CategoriesItem
                        setSelectedCategories={setSelectedCategories}
                        selectedCategories={selectedCategories}
                        key={category.slug}
                        categories={category}
                      />
                    ))}
                </ul>
              </div>
              <div className="filter_type">
                <div className="form-group">
                  <h3 className="filter-title">কোর্সের দাম</h3>
                  <ul>
                    {filterPrice.map((item) => (
                      <li key={`filterPrice_${item}`}>
                        <div>
                          <input
                            type="radio"
                            id={`price_${item}`}
                            name="price"
                            className="prices custom-radio"
                            value={item}
                            onChange={() => setPrice(item)}
                            checked={price === item}
                          />
                          <label
                            htmlFor={`price_${item}`}
                            className="text-capitalize cursor-pointer"
                          >
                            {item}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="filter_type">
                <h3 className="filter-title">কোর্সের স্তর</h3>
                <ul>
                  {filterLevel.map((item) => (
                    <li
                      key={`filterLevel__key${item}`}
                      className="text-capitalize"
                    >
                      <div>
                        <input
                          onChange={() => setLevel(item)}
                          checked={level === item}
                          type="radio"
                          id={`label_${item}`}
                          value={item}
                          name="level"
                          className="level custom-radio"
                        />
                        <label
                          className="cursor-pointer text-capitalize"
                          htmlFor={`label_${item}`}
                        >
                          {item}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="course-left-banner">
            <Image
              height={800}
              width={308}
              src={"/left-banner.svg"}
              alt="feature course"
            />
          </div>
        </div>
        <div className="courses-aria">
          {!courses.isServer && loading ? (
            <div className="d-flex justify-content-center loading">
              <Loading />
            </div>
          ) : (
            <div className="flex courses-card-items corses-card-items-vertical">
              {courses?.data &&
                [...courses?.data].map((course) => (
                  <CourseItem course={course} key={course.id} />
                ))}
            </div>
          )}
          {courses?.data?.length === 0 && !loading && (
            <div className="loading">
              <p className="center">কোনো কোর্স খুঁজে পাওয়া যায়নি !!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainCourses;

const CategoriesItem = ({
  categories,
  setSelectedCategories,
  selectedCategories,
}) => {
  const { name, slug, subCategory, courseCount } = categories;

  return (
    <>
      <li>
        <div className="d-flex">
          <input
            type="radio"
            id={`category_${slug}`}
            onChange={() => setSelectedCategories(slug)}
            checked={selectedCategories === slug}
            value={slug}
            name="sub_category"
            className="categories custom-radio"
          />
          <label
            className="cursor-pointer text-capitalize"
            htmlFor={`category_${slug}`}
          >
            {name}
          </label>
          {/* <div className="ms-auto">({courseCount})</div> */}
        </div>
      </li>
      {subCategory.map(({ slug, name, courseCount }) => (
        <li key={slug}>
          <div className=" d-flex">
            <input
              onChange={() => setSelectedCategories(slug)}
              checked={selectedCategories === slug}
              value={slug}
              type="radio"
              id={`category_${slug}`}
              name="sub_category"
              className="categories custom-radio"
            />
            <label
              className="cursor-pointer text-capitalize"
              htmlFor={`category_${slug}`}
            >
              {name}
            </label>
            {/* <div className="ms-auto">({courseCount})</div> */}
          </div>
        </li>
      ))}
    </>
  );
};
