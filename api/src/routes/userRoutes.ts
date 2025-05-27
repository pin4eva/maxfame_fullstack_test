import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

// Get all users with pagination
router.get('/', UserController.getAllUsers);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Create new user
router.post('/', UserController.createUser);

// Update user
router.put('/:id', UserController.updateUser);

// Soft delete user
router.delete('/:id', UserController.deleteUser);

// Hard delete user
router.delete('/:id/permanent', UserController.hardDeleteUser);

export default router;