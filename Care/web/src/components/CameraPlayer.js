import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { joinCameraStream, leaveCameraStream } from '../services/onvif/camera-api';
// Fix for React 18 compatibility - import JSMpeg dynamically
let JSMpeg;
try {
  JSMpeg = require('jsmpeg').default || require('jsmpeg');
} catch (e) {
  console.warn('JSMpeg loading error:', e);
}

/**
 * A component for displaying RTSP camera streams
 */
const CameraPlayer = ({ stream, width = '100%', height = '100%' }) => {
  const canvasRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canvasReady, setCanvasReady] = useState(false);
  
  // Using useLayoutEffect to ensure the canvas reference is set before attempting to use it
  useLayoutEffect(() => {
    if (canvasRef && canvasRef.current) {
      setCanvasReady(true);
      console.log("Canvas element is ready");
    } else {
      console.log("Canvas element not ready yet");
    }
    
    return () => {
      setCanvasReady(false);
    };
  }, [canvasRef.current]);
  
  // Add this useEffect to ensure the socket.io connection is initialized
  useEffect(() => {
    // Initialize Socket.IO connection if needed
    if (stream && stream.id) {
      try {
        joinCameraStream(stream.id);
      } catch (error) {
        console.error("Failed to join camera stream:", error);
      }
    }
    
    return () => {
      if (stream && stream.id) {
        try {
          leaveCameraStream(stream.id);
        } catch (error) {
          console.error("Error leaving camera stream:", error);
        }
      }
    };
  }, [stream]);

  // Main player initialization effect that only runs when canvas is ready
  useEffect(() => {
    // Don't try to initialize if stream is missing or canvas isn't ready
    if (!stream || !stream.wsUrl) {
      setError('Invalid stream configuration');
      setIsLoading(false);
      return;
    }
    
    if (!canvasReady) {
      console.log("Waiting for canvas to be ready before initializing player");
      return; // Exit if canvas isn't ready
    }
    
    console.log("Canvas is ready, initializing player now");
    
    // Clean up loading state after 1 second (in case of immediate success)
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Start loading the player
    try {
      // Check if JSMpeg is available
      if (!JSMpeg) {
        throw new Error('JSMpeg not available - cannot load player');
      }
      
      // Double check that canvas reference is available
      if (!canvasRef || !canvasRef.current) {
        throw new Error('Canvas element not available');
      }
      
      // Choose between real camera or simulation based on environment
      if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_USE_REAL_CAMERAS === 'true') {
        // PRODUCTION MODE - Use real camera stream via WebSocket
        console.log("Using real camera feed from WebSocket");
        
        // Create WebSocket connection and player
        const wsUrl = stream.wsUrl.replace('localhost', window.location.hostname);
        console.log(`Connecting to WebSocket stream at: ${wsUrl}`);
        
        const player = new JSMpeg.Player(wsUrl, {
          canvas: canvasRef.current,
          autoplay: true,
          audio: false,
          pauseWhenHidden: false,
          onPlay: () => {
            setIsLoading(false);
            setError(null);
            console.log("Camera stream playing");
          },
          onError: (err) => {
            console.error('JSMpeg error:', err);
            setError('Failed to connect to camera stream');
            setIsLoading(false);
          }
        });
        
        playerRef.current = player;
        
        return () => {
          clearTimeout(loadingTimeout);
          if (playerRef.current) {
            playerRef.current.destroy();
          }
        };
      } else {
        // DEVELOPMENT/DEMO MODE - Use simulated camera feed
        console.log("Using simulated camera feed");
      
      // Simulation mode - draw a moving pattern on canvas to simulate video
      const canvas = canvasRef.current;
      
      // Final safety check for canvas
      if (!canvas) {
        throw new Error('Canvas element not available');
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }
      
      let frameCount = 0;
      
      // Set canvas dimensions
      canvas.width = 640;
      canvas.height = 480;
      
      const simulateVideo = () => {
        // Ensure loading is turned off and error is cleared
        if (isLoading) {
          setIsLoading(false);
        }
        
        if (error) {
          setError(null);
        }
        
        frameCount++;
        
        try {
          // Ensure canvas and context are still valid
          if (!canvas || !ctx) {
            console.error("Canvas or context no longer available");
            return;
          }
          
          // Clear canvas
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw camera feed simulation (moving pattern)
          const time = frameCount / 30; // Simulated time in seconds
          
          // Draw camera info overlay
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(10, 10, 250, 30);
          ctx.fillStyle = '#fff';
          ctx.font = '14px Arial';
          ctx.fillText(`${stream.id || 'Camera'} - LIVE FEED`, 20, 30);
          
          // Draw time indicator
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(canvas.width - 110, 10, 100, 30);
          ctx.fillStyle = '#fff';
          const date = new Date();
          ctx.fillText(date.toLocaleTimeString(), canvas.width - 100, 30);
          
          // Draw moving elements to simulate video
          for (let i = 0; i < 5; i++) {
            const x = (Math.sin(time + i * 0.7) * 0.5 + 0.5) * canvas.width;
            const y = (Math.cos(time * 0.8 + i * 0.5) * 0.5 + 0.5) * canvas.height;
            const size = 10 + Math.sin(time * 2 + i) * 5;
            
            ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 100, 100, 0.7)' : 'rgba(100, 100, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Random background movement
          for (let i = 0; i < 50; i++) {
            const x = (Math.sin(time * 0.5 + i * 2.5) * 0.5 + 0.5) * canvas.width;
            const y = (Math.cos(time * 0.3 + i * 1.5) * 0.5 + 0.5) * canvas.height;
            
            ctx.fillStyle = `rgba(150, 150, 150, ${Math.sin(time + i) * 0.25 + 0.25})`;
            ctx.fillRect(x, y, 3, 3);
          }
          
          // Signal animation
          if (frameCount % 30 < 15) {
            ctx.fillStyle = '#f44336';
          } else {
            ctx.fillStyle = '#555';
          }
          ctx.beginPath();
          ctx.arc(canvas.width - 20, 20, 5, 0, Math.PI * 2);
          ctx.fill();
          
          // Continue animation loop
          const animationId = requestAnimationFrame(simulateVideo);
          
          // Update player reference
          playerRef.current = {
            animationFrame: animationId,
            destroy: () => {
              if (playerRef.current && playerRef.current.animationFrame) {
                cancelAnimationFrame(playerRef.current.animationFrame);
              }
            }
          };
        } catch (error) {
          console.error("Error in animation loop:", error);
          // Don't set error state to avoid infinite loop
        }
      };
      
      // Start the simulation immediately and set loading to false
      // Only run simulation if we're in development/demo mode
      if (process.env.NODE_ENV !== 'production' && process.env.REACT_APP_USE_REAL_CAMERAS !== 'true') {
        const simulateVideoAndClearLoading = () => {
          // Mark loading as complete immediately
          setIsLoading(false);
          setError(null);
          
          // Then start the animation
          return simulateVideo();
        };
        
        // Create player with immediate start
        const player = {
          animationFrame: requestAnimationFrame(simulateVideoAndClearLoading),
          destroy: () => {
            if (playerRef.current && playerRef.current.animationFrame) {
              cancelAnimationFrame(playerRef.current.animationFrame);
            }
          }
        };
        
        playerRef.current = player;
      }
      
      // Create cleanup function
      let errorTimeout;
      
      // Only for simulation mode
      if (process.env.NODE_ENV !== 'production' && process.env.REACT_APP_USE_REAL_CAMERAS !== 'true') {
        // Set error timeout only for simulation mode
        errorTimeout = setTimeout(() => {
          if (isLoading) {
            console.log("Stream timed out - forcing loading to complete anyway");
            setIsLoading(false);
          }
        }, 1500);
      }
      
      return () => {
        // Clean up timeouts and player
        clearTimeout(loadingTimeout);
        if (errorTimeout) {
          clearTimeout(errorTimeout);
        }
        
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
      };
    }
  } catch (err) {
    console.error('Error initializing video player:', err);
    setError(`Failed to initialize player: ${err.message}`);
    setIsLoading(false);
    clearTimeout(loadingTimeout);
    return () => {};
  }
  }, [stream, canvasReady]); // Added canvasReady as a dependency
  
  // Define the canvas element early but keep it hidden if there's an error
  const renderCanvas = () => (
    <Box 
      sx={{ 
        width, 
        height, 
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'black'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          // Make canvas visible only when no errors
          display: (isLoading || error) ? 'none' : 'block'
        }}
        width="640"
        height="480"
      />
      
      {/* Overlay for loading or error states */}
      {(isLoading || error) && (
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'black',
            color: 'white',
            zIndex: 10
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress color="primary" size={48} sx={{ mb: 2 }} />
              <Typography variant="body1">Connecting to camera stream...</Typography>
            </>
          ) : (
            <>
              <Typography variant="body1" color="error">
                {error || 'Error loading camera stream'}
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, maxWidth: '80%', textAlign: 'center' }}>
                Please check your camera settings and ensure the camera is online.
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
  
  // Always render the canvas even during errors, this ensures it's available in the DOM
  return renderCanvas();
};

export default CameraPlayer;