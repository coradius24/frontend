"use client";
import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";

const useQueryParams = (initialState = {}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState(() => {
    return initialState;
  });

  useEffect(() => {
    router.replace(`${pathname}?${queryString.stringify(state)}`);
  }, [state]);

  return [state, setState];
};

export default useQueryParams;
