"use client";

import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const params = useSearchParams();

  let start = params.get('startDate');
  let end = params.get('endDate');

  console.log(start, end);

  return (
    <div>SearchPage</div>
  )
}

export default SearchPage