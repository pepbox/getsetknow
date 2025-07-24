import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import adminModel from '../models/admin.model';

const adminService = new AdminService(adminModel);
// Assume adminService is instantiated and exported from somewhere

export async function fetchAdminByIdController(req: Request, res: Response) {
    try {
        const adminId = req.user?.id;
        const admin = await adminService.fetchAdminById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export async function createAdminController(req: Request, res: Response) {
    try {
        const admin = await adminService.createAdmin(req.body);
        res.status(201).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export async function updateAdminController(req: Request, res: Response) {
    try {
        const adminId = req.user?.id;
        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is required' });
        }
        const admin = await adminService.updateAdmin(adminId,req.body);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export async function deleteAdminController(req: Request, res: Response) {
    try {
        const adminId = req.user?.id;
        if (!adminId) {         
            return res.status(400).json({ message: 'Admin ID is required' });
        }   
        const admin = await adminService.deleteAdmin(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}