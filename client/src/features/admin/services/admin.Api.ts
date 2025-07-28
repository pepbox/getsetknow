import { api } from '../../../app/api';

export interface AdminLoginRequest {
  password: string;
  sessionId: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  admin?: {
    id: string;
    name: string;
  };
}

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<AdminLoginResponse, AdminLoginRequest>({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    adminLogout: builder.mutation({
      query: () => ({
        url: '/admin/logout',
        method: 'POST',
      }),
    }),


    fetchAdmin: builder.query({
      query: () => ({
        url: '/admin/fetchAdmin',
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
    }),

    updateSession: builder.mutation({
      query: (updateData) => ({
        url: '/session/update',
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ["AdminPlayer"],
    }),

    fetchDashboardData: builder.query({
      query: () => ({
        url: '/admin/fetchDashboardData',
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["AdminPlayer"],
    }),

    updatePlayer: builder.mutation({
      query: (updateData) => ({
        url: '/admin/updatePlayer',
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ["AdminPlayer"],
    }),

    getPlayerWithResponses: builder.query({
      query: (playerId: string) => ({
        url: `/admin/getPlayerWithResponses${playerId}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
      // providesTags: ["AdminPlayer"],
    }),

  }),

});

export const { 
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useUpdateSessionMutation,
  useFetchDashboardDataQuery,
  useUpdatePlayerMutation,
  useLazyGetPlayerWithResponsesQuery,
  useLazyFetchAdminQuery
} = adminApi;
