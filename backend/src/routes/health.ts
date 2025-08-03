import { Router, Request, Response } from 'express';
import { HealthCheckService } from '../services/healthCheckService.js';

const router = Router();

// Basic health check endpoint for load balancers
router.get('/health', async (req: Request, res: Response) => {
  try {
    const status = await HealthCheckService.getBasicStatus();
    res.status(status.status === 'ok' ? 200 : 503).json(status);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Detailed health check for monitoring systems
router.get('/health/detailed', async (req: Request, res: Response) => {
  try {
    const healthCheck = await HealthCheckService.performHealthCheck();
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Readiness probe (for Kubernetes/container orchestration)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const status = await HealthCheckService.getBasicStatus();
    if (status.status === 'ok') {
      res.status(200).json({ ready: true, timestamp: status.timestamp });
    } else {
      res.status(503).json({ ready: false, timestamp: status.timestamp });
    }
  } catch (error) {
    res.status(503).json({
      ready: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Liveness probe (for Kubernetes/container orchestration)
router.get('/live', (req: Request, res: Response) => {
  // Simple liveness check - if the server is running, it's alive
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
