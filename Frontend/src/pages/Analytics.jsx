import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import AnalyticsUI from '../components/AnalyticsUI'; // Rename your current Analytics component to AnalyticsUI
import Navbar from '../components/Navbar';

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await api.getAllExpenses();
        setExpenses(response.data);
      } catch (error) {
        console.error("Failed to fetch expenses for analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center ml-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If loading is done, render the UI with the fetched expenses
  return <AnalyticsUI expenses={expenses} />;
};

export default Analytics;