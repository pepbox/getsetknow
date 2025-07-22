import { createSlice } from '@reduxjs/toolkit';
import { SerializedError } from '@reduxjs/toolkit';
import { playerApi } from './player.api';

export interface IPlayer {
    name: string;
    profilePhoto?: string;
    session?: string;
}

const initialState = {
    player: null as IPlayer | null,
    isLoading: false,
    error: null as SerializedError | null,
};

const playerSlice = createSlice({
    name: 'Player',
    initialState,
    reducers: {
        setPlayer: (state, action) => {
            state.player = action.payload;
        },
        clearPlayer: (state) => {
            state.player = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                playerApi.endpoints.onboardPlayer.matchPending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                playerApi.endpoints.onboardPlayer.matchFulfilled,
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                playerApi.endpoints.onboardPlayer.matchRejected,
                (state, { error }) => {
                    state.isLoading = false;
                    state.error = error;
                }
            );



    },
});

export const { setPlayer, clearPlayer } = playerSlice.actions;

export default playerSlice.reducer;