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

        
    }),
});

export const {
    useOnboardPlayerMutation,
} = playerApi;