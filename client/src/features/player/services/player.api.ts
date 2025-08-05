import { api } from "../../../app/api";

export const playerApi = api.injectEndpoints({
    endpoints: (builder) => ({

        onboardPlayer: builder.mutation({
            query: (body) => ({
                url: '/player/onboardPlayer',
                method: 'POST',
                body,
            }),
        }),

        fetchPlayer: builder.query({
            query: () => ({
                url: '/player/fetchPlayer',
                method: 'GET',
            }),
        }),


        getAllTeams: builder.query({
            query: (sessionId) => ({
                url: `/player/getAllTeams/${sessionId}`,
                method: 'GET',
            }),
            transformResponse: (response: { data: any[] }) => response.data,
        }),


    }),
});

export const {
    useOnboardPlayerMutation,
    useLazyFetchPlayerQuery,
    useGetAllTeamsQuery,
} = playerApi;