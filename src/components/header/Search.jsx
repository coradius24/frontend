"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const Search = () => {
  const router = useRouter();
  const search = useRef();
  const handleSearch = (e) => {
    e.preventDefault();
    router.replace(`/courses?search=${search.current.value}`);
    router.refresh();
  };
  return (
    <div className="header-search-box medium-hide small-hide">
      <search>
        <form id="search" onSubmit={handleSearch}>
          <input
            name="search"
            ref={search}
            type="text"
            placeholder="আপনার কাঙ্খিত কোর্সটি সার্চ করুন"
          />
        </form>
      </search>
      <img
        onClick={handleSearch}
        className="search-icon"
        src="/search.svg"
        alt="search-icon"
      />
    </div>
  );
};

export default Search;
