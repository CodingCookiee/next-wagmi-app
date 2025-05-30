"use client";

import React, { useEffect, useState } from "react";
import { Text } from "./text";
import { Loader } from "./loader";

/**
 * A reusable overlay component for page transitions, redirects, and loading states
 * 
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the overlay
 * @param {string} props.message - The message to display
 * @param {string} props.status - The status of the transition ('loading', 'success', 'error')
 * @param {boolean} props.autoHide - Whether to automatically hide the overlay after a delay (for success/error states)
 * @param {number} props.autoHideDuration - Duration in ms before auto-hiding (default: 2000ms)
 * @param {string} props.bgColor - Background color class of the overlay
 * @param {string} props.textColor - Text color class
 * @param {function} props.onHide - Callback when overlay is hidden
 * @param {React.ReactNode} props.icon - Custom icon to display instead of the default loader
 */
export const PageTransitionOverlay = ({
  show = false,
  message = "Loading...",
  status = "loading", // 'loading', 'success', 'error'
  autoHide = false,
  autoHideDuration = 2000,
  bgColor = "bg-white/70 dark:bg-gray-900/70",
  textColor = "text-primary dark:text-white",
  onHide,
  icon,
}) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Handle visibility changes with animation
  useEffect(() => {
    if (show && !visible) {
      setAnimating(true);
      setVisible(true);
    } else if (!show && visible) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimating(false);
        if (onHide) onHide();
      }, 300); // Match the CSS transition duration
      
      return () => clearTimeout(timer);
    }
  }, [show, visible, onHide]);

  // Handle auto-hide for success/error states
  useEffect(() => {
    if (autoHide && visible && (status === "success" || status === "error")) {
      const timer = setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          setVisible(false);
          setAnimating(false);
          if (onHide) onHide();
        }, 300); // Match the CSS transition duration
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [autoHide, visible, status, autoHideDuration, onHide]);

  // When not visible at all, don't render anything
  if (!visible && !animating) return null;

  // Opacity classes based on current state
  const opacityClass = show ? "opacity-100" : "opacity-0";

  const renderIcon = () => {
    if (icon) return icon;
    
    if (status === "success") {
      return (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
          <svg 
            className="w-10 h-10 text-green-500 dark:text-green-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );
    }
    
    if (status === "error") {
      return (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900">
          <svg 
            className="w-10 h-10 text-red-500 dark:text-red-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      );
    }
    
    return <Loader width="w-12" height="h-12" />;
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md ${bgColor} transition-opacity duration-300 ${opacityClass}`}
      onClick={autoHide ? () => {
        setAnimating(true);
        setTimeout(() => {
          setVisible(false);
          setAnimating(false);
          if (onHide) onHide();
        }, 300);
      } : undefined}
    >
      <div className="flex flex-col items-center justify-center p-8 rounded-lg max-w-md">
        <div className="mb-4">
          {renderIcon()}
        </div>
        
        <Text 
          variant="h3" 
          className={`text-center ${textColor}`}
        >
          {message}
        </Text>
        
        {autoHide && (
          <Text 
            variant="small" 
            color="secondary" 
            className="mt-4 opacity-80"
          >
            (Tap anywhere to dismiss)
          </Text>
        )}
      </div>
    </div>
  );
};

// Also export a specialized version for redirects
export const RedirectOverlay = ({ 
  show, 
  destination = "the next page", 
  onHide,
  ...props 
}) => {
  return (
    <PageTransitionOverlay
      show={show}
      message={`Redirecting to ${destination}...`}
      status="loading"
      autoHide={false}
      bgColor="bg-indigo-50/80 dark:bg-indigo-950/80"
      onHide={onHide}
      {...props}
    />
  );
};