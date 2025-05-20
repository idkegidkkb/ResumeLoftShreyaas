import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProFeatureGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProFeatureGate: React.FC<ProFeatureGateProps> = ({ children, fallback }) => {
  const { user, loading } = useAuth();
  
  // If loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>; // Or null, or a spinner component
  }
  
  // Check if the user is logged in and has a pro subscription
  // The main fix: use optional chaining and double-check the is_pro field exists
  const isPro = user?.profile?.is_pro === true;
  
  if (isPro) {
    // If user is pro, render the children (the pro content)
    return <>{children}</>;
  } else {
    // If user is not pro or not logged in, render the fallback or a default message
    return fallback || <p>This feature is available to Pro subscribers only.</p>;
  }
};

export default ProFeatureGate