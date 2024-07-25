import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../common/constants/apiConstants";

export interface Court {
  court_id: number;
  court_name: string;
  registered_at: string;
  opening_time: string;
  closing_time: string;
  price_hour: string;
  court_structure_type_id: number;
  court_surface_type_id: number;
  is_active: boolean;
  club_id: number;
  price_hour_non_subscriber?: number;
  image?: string;
}
export interface PaginatedCourts {
  courts: Court[];
  totalPages: number;
}

export const courtsSlice = createApi({
  reducerPath: "courts",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getCourts: builder.query({
      query: () => "/courts",
    }),
    getPaginatedCourts: builder.query({
      query: (filter) =>
        `courts/paginated?page=${filter.page}&locationId=${filter.locationId}&clubId=${filter.clubId}&courtSurfaceType=${filter.courtSurfaceType}&courtStructureType=${filter.courtStructureType}&textSearch=${filter.textSearch}&isActive=${filter.isActive}&proximityLocationId=${filter.proximityLocationId}&column=${filter.column}&direction=${filter.direction}`,
    }),
    getCourtById: builder.query({
      query: (court_id) => `/courts/${court_id}`,
    }),
    getClubCourts: builder.query({
      query: (clubId) => `courts/get-club-courts/${clubId}`,
    }),
    getCourtDetails: builder.query({
      query: (court_id) => `/courts/court-details/${court_id}`,
    }),
    getCourtsByFilter: builder.query({
      query: (filter) => `/courts/filter?${new URLSearchParams(filter)}`,
    }),
    deactivateDeletedClubCourts: builder.mutation({
      query: (clubId) => ({
        url: `/courts/deactivate-club-courts/${clubId}`,
        method: "POST",
      }),
    }),
    addCourt: builder.mutation({
      query: (court) => {
        const formData = new FormData();
        formData.append("court_name", court.court_name);
        formData.append("opening_time", court.opening_time.toString());
        formData.append("closing_time", court.closing_time.toString());
        formData.append("price_hour", court.price_hour.toString());
        formData.append("is_active", court.is_active);
        formData.append(
          "court_structure_type_id",
          court.court_structure_type_id.toString()
        );
        formData.append(
          "court_surface_type_id",
          court.court_surface_type_id.toString()
        );
        formData.append("club_id", court.club_id.toString());

        if (court.price_hour_non_subscriber) {
          formData.append(
            "price_hour_non_subscriber",
            court.price_hour_non_subscriber.toString()
          );
        }
        if (court.image) {
          formData.append("image", court.image);
        }
        const requestObject = {
          url: "/courts",
          method: "POST",
          body: formData,
        };

        return requestObject;
      },
    }),
    updateCourt: builder.mutation({
      query: (court) => {
        const formData = new FormData();
        if (court.court_id) {
          formData.append("court_id", court.court_id);
        }
        formData.append("court_name", court.court_name);
        formData.append("opening_time", court.opening_time.toString());
        formData.append("closing_time", court.closing_time.toString());
        formData.append("price_hour", court.price_hour.toString());
        formData.append("is_active", court.is_active);
        formData.append(
          "court_structure_type_id",
          court.court_structure_type_id.toString()
        );
        formData.append(
          "court_surface_type_id",
          court.court_surface_type_id.toString()
        );
        formData.append("club_id", court.club_id.toString());

        if (court.price_hour_non_subscriber) {
          formData.append(
            "price_hour_non_subscriber",
            court.price_hour_non_subscriber.toString()
          );
        }
        if (court.image) {
          formData.append("image", court.image);
        }
        const requestObject = {
          url: "/courts",
          method: "PUT",
          body: formData,
        };

        return requestObject;
      },
    }),
  }),
});

export const {
  useGetCourtsQuery,
  useGetPaginatedCourtsQuery,
  useGetCourtByIdQuery,
  useGetClubCourtsQuery,
  useGetCourtDetailsQuery,
  useGetCourtsByFilterQuery,
  useAddCourtMutation,
  useDeactivateDeletedClubCourtsMutation,
  useUpdateCourtMutation,
} = courtsSlice;
