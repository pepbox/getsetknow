import { Model, Types } from 'mongoose';
import { IAdmin } from '../types/interface';

export class AdminService {
    private adminModel: Model<IAdmin>;

    constructor(adminModel: Model<IAdmin>) {
        this.adminModel = adminModel;
    }

    async fetchAdminById(id: Types.ObjectId): Promise<IAdmin | null> {
        return this.adminModel.findById(id).exec();
    }

    async createAdmin(adminData: Partial<IAdmin>): Promise<IAdmin> {
        const admin = new this.adminModel(adminData);
        return admin.save();
    }

    async updateAdmin(id: Types.ObjectId, updateData: Partial<IAdmin>): Promise<IAdmin | null> {
        return this.adminModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async deleteAdmin(id: Types.ObjectId): Promise<IAdmin | null> {
        return this.adminModel.findByIdAndDelete(id).exec();
    }
}