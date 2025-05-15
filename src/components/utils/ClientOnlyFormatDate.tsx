'use client';

import React, { useState, useEffect } from 'react';

interface ClientOnlyFormatDateProps {
  timestamp: number | string;
  placeholder?: string;
}

const ClientOnlyFormatDate: React.FC<ClientOnlyFormatDateProps> = ({ timestamp, placeholder = "" }) => {
  const [formattedDate, setFormattedDate] = useState<string>(placeholder);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        const date = new Date(timestamp);
        // Check if date is valid before formatting
        if (!isNaN(date.getTime())) {
          setFormattedDate(date.toLocaleString());
        } else {
          setFormattedDate("Invalid Date");
        }
      } catch (error) {
        console.error("Error formatting date:", error);
        setFormattedDate("Error");
      }
    }
  }, [timestamp, isMounted]);

  if (!isMounted) {
    return <>{placeholder}</>; // Render placeholder or nothing on server and initial client render
  }

  return <>{formattedDate}</>;
};

export default ClientOnlyFormatDate;