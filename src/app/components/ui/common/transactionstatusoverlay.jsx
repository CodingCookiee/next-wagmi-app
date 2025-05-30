import React, { useEffect, useState } from "react";
import { Text } from "./text";
import { Loader } from "./loader";

export const TransactionStatusOverlay = ({ 
  isWritePending, 
  isConfirming, 
  isConfirmed,
  pendingMessage = "Processing Your Request ...",
  confirmingMessage = "Waiting for Confirmation...",
  confirmedMessage = "Hurrah! Transaction Confirmed."
}) => {
  // const [showConfirmed, setShowConfirmed] = useState(false);
  
  // useEffect(() => {
  //   if (isConfirmed) {
  //     setShowConfirmed(true);
  //     const timer = setTimeout(() => {
  //       setShowConfirmed(false);
  //     }, 500);
      
  //     return () => clearTimeout(timer);
  //   }
  // }, [isConfirmed]);

  if (isWritePending) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-lg bg-blue-100/70">
        <div className="flex items-center justify-center gap-4">
          <Loader height='10px' />
          <Text variant="h2" color='secondary'>
            {pendingMessage}
          </Text>
        </div>
      </div>
    );
  }
  
  if (isConfirming) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-lg bg-blue-100/70">
        <div className="flex items-center justify-center gap-2.5">
          <Loader height='10px' />
          <Text variant="h2" color='secondary'>
            {confirmingMessage}
          </Text>
        </div>
      </div>
    );
  }
  
  // if (showConfirmed) {
  //   return (
  //     <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-lg bg-blue-100/70">
  //       <div className="flex items-center justify-center gap-2.5">
  //         <Loader height='10px' />
  //         <Text variant="h2" color='secondary'>
  //           {confirmedMessage}
  //         </Text>
  //       </div>
  //     </div>
  //   );
  // }
  
  return null;
};
