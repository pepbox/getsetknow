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

    fetchLeaderboardData: builder.query({
      query: () => ({
        url: '/admin/fetchLeaderboardData',
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["Selfie"],
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
        url: `/admin/getPlayerWithResponses/${playerId}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
      // providesTags: ["AdminPlayer"],
    }),

    checkPlayersReadiness: builder.query({
      query: () => ({
        url: '/admin/checkPlayersReadiness',
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
    }),

    downloadSessionSelfies: builder.mutation<Blob, string>({
      query: (sessionId) => ({
        url: `/session/download-selfies/${sessionId}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),

    fetchSessionQuestions: builder.query<any[], void>({
      query: () => ({
        url: '/admin/questions',
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ['SessionQuestions'],
    }),

    selectSessionQuestions: builder.mutation<any, { questionIds: string[] }>({
      query: (body) => ({
        url: '/admin/questions/select',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['SessionQuestions', 'AdminPlayer'],
    }),

    addCustomQuestion: builder.mutation<any, { questionText: string; keyAspect: string }>({
      query: (body) => ({
        url: '/admin/questions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SessionQuestions', 'AdminPlayer'],
    }),

  }),

});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useUpdateSessionMutation,
  useFetchDashboardDataQuery,
  useFetchLeaderboardDataQuery,
  useUpdatePlayerMutation,
  useLazyGetPlayerWithResponsesQuery,
  useLazyFetchAdminQuery,
  useLazyCheckPlayersReadinessQuery,
  useDownloadSessionSelfiesMutation,
  useFetchSessionQuestionsQuery,
  useSelectSessionQuestionsMutation,
  useAddCustomQuestionMutation
} = adminApi;
