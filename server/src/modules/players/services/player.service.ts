import { Model, Types } from 'mongoose';
import { IGuess, IPlayer } from '../types/interfaces';
import { Guess } from '../models/guess.model';



class PlayerService {
    private playerModel: Model<IPlayer>;

    constructor(playerModel: Model<IPlayer>) {
        this.playerModel = playerModel;
    }


    async createPlayer(data: Partial<IPlayer>): Promise<IPlayer> {
        const player = new this.playerModel({
            name: data.name,
            profilePhoto: data.profilePhoto,
            session: data.session,
        });
        return await player.save();
    }

    async getPlayerById(id: string): Promise<IPlayer | null> {
        return await this.playerModel.findById(id).populate('session');
    }

    async getPlayersBySession(sessionId: Types.ObjectId): Promise<IPlayer[]> {
        return await this.playerModel.find({ session: sessionId });
    }

    async createGuess(data: { user: Types.ObjectId; personId: Types.ObjectId }): Promise<IGuess> {
        const guess = new Guess({
            user: data.user,
            personId: data.personId,
        });
        return await guess.save();
    }

    async getGuessById(guessId: string): Promise<IGuess | null> {
        return await Guess.findById(guessId);
    }

    async updateGuessById(guessId: string, updateData: Partial<IGuess>): Promise<IGuess | null> {
        return await Guess.findByIdAndUpdate(guessId, updateData, { new: true });
    }
}



export default PlayerService;