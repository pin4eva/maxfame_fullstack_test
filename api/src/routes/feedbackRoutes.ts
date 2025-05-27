import { Router } from 'express';
import { FeedbackController } from '../controllers/feedbackController';

const router = Router();

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedback
 *     description: Retrieve all feedback entries with pagination and optional rating filter
 *     tags: [Feedback]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/RatingParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved feedback list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeedbackListResponse'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     - _id: "507f1f77bcf86cd799439011"
 *                       name: "John Doe"
 *                       email: "john.doe@example.com"
 *                       feedback: "Great service! Very satisfied with the experience."
 *                       rating: 5
 *                       createdAt: "2023-12-01T10:30:00.000Z"
 *                       updatedAt: "2023-12-01T10:30:00.000Z"
 *                   pagination:
 *                     currentPage: 1
 *                     totalPages: 5
 *                     totalFeedback: 50
 *                     limit: 10
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', FeedbackController.getAllFeedback);

/**
 * @swagger
 * /api/feedback/stats:
 *   get:
 *     summary: Get feedback statistics
 *     description: Retrieve comprehensive statistics about all feedback including total count, average rating, and rating distribution
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: Successfully retrieved feedback statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeedbackStats'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     totalFeedback: 150
 *                     averageRating: 4.2
 *                     ratingDistribution:
 *                       - _id: 1
 *                         count: 5
 *                       - _id: 2
 *                         count: 10
 *                       - _id: 3
 *                         count: 20
 *                       - _id: 4
 *                         count: 60
 *                       - _id: 5
 *                         count: 55
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', FeedbackController.getFeedbackStats);

/**
 * @swagger
 * /api/feedback/email/{email}:
 *   get:
 *     summary: Get feedback by email
 *     description: Retrieve all feedback entries for a specific email address with pagination
 *     tags: [Feedback]
 *     parameters:
 *       - $ref: '#/components/parameters/EmailParam'
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved feedback for the email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeedbackListResponse'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     - _id: "507f1f77bcf86cd799439011"
 *                       name: "John Doe"
 *                       email: "john.doe@example.com"
 *                       feedback: "Great service! Very satisfied."
 *                       rating: 5
 *                       createdAt: "2023-12-01T10:30:00.000Z"
 *                       updatedAt: "2023-12-01T10:30:00.000Z"
 *                   pagination:
 *                     currentPage: 1
 *                     totalPages: 2
 *                     totalFeedback: 15
 *                     limit: 10
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/email/:email', FeedbackController.getFeedbackByEmail);

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     description: Retrieve a specific feedback entry by its unique identifier
 *     tags: [Feedback]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved feedback
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeedbackResponse'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     name: "John Doe"
 *                     email: "john.doe@example.com"
 *                     feedback: "Great service! Very satisfied with the experience."
 *                     rating: 5
 *                     createdAt: "2023-12-01T10:30:00.000Z"
 *                     updatedAt: "2023-12-01T10:30:00.000Z"
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notFound:
 *                 summary: Feedback not found
 *                 value:
 *                   success: false
 *                   message: "Feedback not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', FeedbackController.getFeedbackById);

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create new feedback
 *     description: Create a new feedback entry with name, email, feedback text, and rating
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeedback'
 *           examples:
 *             example1:
 *               summary: Example feedback
 *               value:
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 feedback: "Great service! Very satisfied with the experience and the support team was very helpful."
 *                 rating: 5
 *             example2:
 *               summary: Another example
 *               value:
 *                 name: "Jane Smith"
 *                 email: "jane.smith@example.com"
 *                 feedback: "Good overall experience, but there's room for improvement in response time."
 *                 rating: 4
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeedbackResponse'
 *             examples:
 *               success:
 *                 summary: Successful creation
 *                 value:
 *                   success: true
 *                   message: "Feedback created successfully"
 *                   data:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     name: "John Doe"
 *                     email: "john.doe@example.com"
 *                     feedback: "Great service! Very satisfied with the experience."
 *                     rating: 5
 *                     createdAt: "2023-12-01T10:30:00.000Z"
 *                     updatedAt: "2023-12-01T10:30:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               validationError:
 *                 summary: Validation error example
 *                 value:
 *                   success: false
 *                   message: "Validation error"
 *                   errors:
 *                     - code: "too_small"
 *                       minimum: 2
 *                       type: "string"
 *                       inclusive: true
 *                       exact: false
 *                       message: "Name must be at least 2 characters long"
 *                       path: ["name"]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', FeedbackController.createFeedback);

/**
 * @swagger
 * /api/feedback/{id}:
 *   put:
 *     summary: Update feedback
 *     description: Update an existing feedback entry. All fields are optional - only provided fields will be updated
 *     tags: [Feedback]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFeedback'
 *           examples:
 *             partialUpdate:
 *               summary: Update only rating and feedback
 *               value:
 *                 feedback: "Updated feedback text with more details about the experience."
 *                 rating: 4
 *             fullUpdate:
 *               summary: Update all fields
 *               value:
 *                 name: "John Updated"
 *                 email: "john.updated@example.com"
 *                 feedback: "Completely updated feedback text."
 *                 rating: 3
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeedbackResponse'
 *             examples:
 *               success:
 *                 summary: Successful update
 *                 value:
 *                   success: true
 *                   message: "Feedback updated successfully"
 *                   data:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     name: "John Updated"
 *                     email: "john.updated@example.com"
 *                     feedback: "Updated feedback text."
 *                     rating: 4
 *                     createdAt: "2023-12-01T10:30:00.000Z"
 *                     updatedAt: "2023-12-01T11:45:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notFound:
 *                 summary: Feedback not found
 *                 value:
 *                   success: false
 *                   message: "Feedback not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', FeedbackController.updateFeedback);

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     summary: Delete feedback
 *     description: Permanently delete a feedback entry by its unique identifier
 *     tags: [Feedback]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Feedback deleted successfully"
 *             examples:
 *               success:
 *                 summary: Successful deletion
 *                 value:
 *                   success: true
 *                   message: "Feedback deleted successfully"
 *       404:
 *         description: Feedback not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notFound:
 *                 summary: Feedback not found
 *                 value:
 *                   success: false
 *                   message: "Feedback not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', FeedbackController.deleteFeedback);

export default router;
