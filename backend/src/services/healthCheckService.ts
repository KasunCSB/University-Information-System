import config from '../config/config.js';
import mongoose from 'mongoose';

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'error';
      responseTime?: number;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    uptime: number;
  };
  errors?: string[];
}

export class HealthCheckService {
  static async performHealthCheck(): Promise<HealthCheckResult> {
    const errors: string[] = [];
    
    const result: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: config.NODE_ENV,
      services: {
        database: {
          status: 'disconnected'
        },
        memory: {
          used: 0,
          total: 0,
          percentage: 0
        },
        uptime: process.uptime()
      }
    };

    // Check database connection
    try {
      const dbStartTime = Date.now();
      
      if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        // Test database with a simple query
        await mongoose.connection.db.admin().ping();
        result.services.database = {
          status: 'connected',
          responseTime: Date.now() - dbStartTime
        };
      } else {
        result.services.database.status = 'disconnected';
        errors.push('Database connection not established');
      }
    } catch (error) {
      result.services.database.status = 'error';
      errors.push(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    result.services.memory = {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
    };

    // High memory usage warning
    if (result.services.memory.percentage > 90) {
      errors.push('High memory usage detected');
    }

    // Set overall status
    if (errors.length > 0) {
      result.status = 'unhealthy';
      result.errors = errors;
    }

    return result;
  }

  static async getBasicStatus(): Promise<{ status: string; timestamp: string }> {
    try {
      const isDbConnected = mongoose.connection.readyState === 1;
      return {
        status: isDbConnected ? 'ok' : 'degraded',
        timestamp: new Date().toISOString()
      };
    } catch {
      return {
        status: 'error',
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default HealthCheckService;
