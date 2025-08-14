'use client';

/**
 * WebSocket Connection Test Component
 * Tests external WebSocket connection and displays status
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Activity,
  Globe
} from 'lucide-react';

interface ConnectionStatus {
  websocket: 'connected' | 'disconnected' | 'connecting' | 'error';
  socketio: 'connected' | 'disconnected' | 'connecting' | 'error';
  health: 'healthy' | 'unhealthy' | 'checking' | 'error';
  fallback: 'active' | 'inactive';
}

export function WebSocketConnectionTest() {
  const [status, setStatus] = useState<ConnectionStatus>({
    websocket: 'disconnected',
    socketio: 'disconnected',
    health: 'checking',
    fallback: 'inactive'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Test health endpoint
  const testHealthEndpoint = async () => {
    try {
      setStatus(prev => ({ ...prev, health: 'checking' }));
      
      const response = await fetch('https://wbs.zeabur.app/health');
      
      if (response.ok) {
        setStatus(prev => ({ ...prev, health: 'healthy' }));
        return true;
      } else {
        setStatus(prev => ({ ...prev, health: 'unhealthy' }));
        return false;
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, health: 'error' }));
      setError(`Health check failed: ${error.message}`);
      return false;
    }
  };

  // Test WebSocket connection
  const testWebSocketConnection = async () => {
    try {
      setStatus(prev => ({ ...prev, websocket: 'connecting' }));
      
      const ws = new WebSocket('wss://wbs.zeabur.app/socket.io/');
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          ws.close();
          setStatus(prev => ({ ...prev, websocket: 'error' }));
          resolve(false);
        }, 10000);

        ws.onopen = () => {
          clearTimeout(timeout);
          setStatus(prev => ({ ...prev, websocket: 'connected' }));
          ws.close();
          resolve(true);
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          setStatus(prev => ({ ...prev, websocket: 'error' }));
          resolve(false);
        };
      });
    } catch (error) {
      setStatus(prev => ({ ...prev, websocket: 'error' }));
      return false;
    }
  };

  // Test Socket.IO connection
  const testSocketIOConnection = async () => {
    try {
      setStatus(prev => ({ ...prev, socketio: 'connecting' }));
      
      // Import Socket.IO client dynamically
      const { io } = await import('socket.io-client');
      
      const socket = io('https://wbs.zeabur.app', {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: false
      });

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          socket.disconnect();
          setStatus(prev => ({ ...prev, socketio: 'error' }));
          resolve(false);
        }, 15000);

        socket.on('connect', () => {
          clearTimeout(timeout);
          setStatus(prev => ({ ...prev, socketio: 'connected' }));
          socket.disconnect();
          resolve(true);
        });

        socket.on('connect_error', () => {
          clearTimeout(timeout);
          setStatus(prev => ({ ...prev, socketio: 'error' }));
          socket.disconnect();
          resolve(false);
        });
      });
    } catch (error) {
      setStatus(prev => ({ ...prev, socketio: 'error' }));
      return false;
    }
  };

  // Run all tests
  const runConnectionTests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const healthOk = await testHealthEndpoint();
      
      if (healthOk) {
        await Promise.all([
          testWebSocketConnection(),
          testSocketIOConnection()
        ]);
      }
      
      // Check if fallback is needed
      const needsFallback = status.websocket !== 'connected' && status.socketio !== 'connected';
      setStatus(prev => ({ 
        ...prev, 
        fallback: needsFallback ? 'active' : 'inactive' 
      }));
      
      setLastCheck(new Date());
    } catch (error) {
      setError(`Connection test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-test on mount
  useEffect(() => {
    runConnectionTests();
  }, []);

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case 'connected':
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'connecting':
      case 'checking':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'active':
        return <Activity className="h-4 w-4 text-orange-500" />;
      case 'inactive':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (statusValue: string, label: string) => {
    const variants = {
      connected: 'default',
      healthy: 'default',
      active: 'secondary',
      inactive: 'outline',
      connecting: 'secondary',
      checking: 'secondary',
      disconnected: 'destructive',
      unhealthy: 'destructive',
      error: 'destructive'
    };

    return (
      <Badge variant={variants[statusValue] || 'destructive'} className="flex items-center gap-1">
        {getStatusIcon(statusValue)}
        {label}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          External WebSocket Connection Test
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Health Check</span>
              {getStatusBadge(status.health, status.health.toUpperCase())}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">WebSocket</span>
              {getStatusBadge(status.websocket, status.websocket.toUpperCase())}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Socket.IO</span>
              {getStatusBadge(status.socketio, status.socketio.toUpperCase())}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fallback Mode</span>
              {getStatusBadge(status.fallback, status.fallback.toUpperCase())}
            </div>
          </div>
        </div>

        {/* Server Info */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Server Configuration</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>URL: https://wbs.zeabur.app</div>
            <div>Health: https://wbs.zeabur.app/health</div>
            <div>WebSocket: wss://wbs.zeabur.app/socket.io/</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {lastCheck && `Last checked: ${lastCheck.toLocaleTimeString()}`}
          </div>
          
          <Button
            onClick={runConnectionTests}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}