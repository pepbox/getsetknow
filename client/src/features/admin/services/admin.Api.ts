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
    updateSession: builder.mutation({
      query: (updateData) => ({
        url: '/session/update',
        method: 'PUT',
        body: updateData,
      }),
    }),

    fetchDashboardData: builder.query({
      query: () => ({
        url: '/admin/fetchDashboardData',
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
    }),
    updatePlayer: builder.mutation({
      query: (updateData) => ({
        url: '/admin/updatePlayer',
        method: 'PUT',
        body: updateData,
      }),
    }),

  }),

});

export const { useAdminLoginMutation,
  useUpdateSessionMutation,
  useFetchDashboardDataQuery,
  useUpdatePlayerMutation,
} = adminApi;
