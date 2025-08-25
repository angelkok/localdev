import { Router, Request, Response, NextFunction } from 'express';

const router = Router();


/**
 * @swagger
 * tags:
 *   - name: Default
 *     description: Default routes for the service
 *
 * paths:
 *   /:
 *     get:
 *       summary: Health check
 *       description: Returns a simple hello world message to indicate the service is running.
 *       tags: [Default]
 *       responses:
 *         '200':
 *           description: Service is up and running.
 *           content:
 *             text/plain:
 *               schema:
 *                 type: string
 *                 example: 'Node-ts-service: Hello World!!!'
 *
 */
router.get('/', (req: Request, res: Response) => {
  res.send('Node-ts-service: Hello World!!!');
});

/**
 * @swagger
 *   /status:
 *     get:
 *       summary: Get service status
 *       description: Returns the current status and version of the service.
 *       tags: [Default]
 *       responses:
 *         '200':
 *           description: A JSON object with service status.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: 'This is version 1'
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: '2023-10-27T10:00:00.000Z'
 *
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'This is version 1',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 *   /error:
 *     get:
 *       summary: Trigger a simulated error
 *       description: This route intentionally triggers an error to demonstrate the error handling middleware.
 *       tags: [Default]
 *       responses:
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: 'Something went wrong!'
 *                   message:
 *                     type: string
 *                     example: 'This is a simulated error!'
 */
router.get('/error', (req: Request, res: Response, next: NextFunction) => {
  next(new Error('This is a simulated error!'));
});

export default router;
