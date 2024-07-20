import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "src/constants";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQuery,
  refetchOnMountOrArgChange: true,
  tagTypes: ["user"],
  endpoints: () => ({}),
});
