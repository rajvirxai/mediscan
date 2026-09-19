import React, { useState, useEffect } from 'react';

const AlarmNotifier = ({ schedules = [] }) => {
  const [activeAlarms, setActiveAlarms] = useState([]);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    const checkAlarms = () => {
      const now = new Date();
      schedules.forEach((schedule) => {
        const scheduleTime = new Date(schedule.scheduledTime);
        // Check if the current time matches the scheduled time (within a 30s window)
        // and ensure we haven't already fired this specific alarm
        if (
          Math.abs(now - scheduleTime) < 30000 &&
          !activeAlarms.includes(schedule.id)
        ) {
          triggerAlarm(schedule);
        }
      });
    };

    // Check every 10 seconds
    const intervalId = setInterval(checkAlarms, 10000);
    return () => clearInterval(intervalId);
  }, [schedules, activeAlarms]);

  const triggerAlarm = (schedule) => {
    setActiveAlarms((prev) => [...prev, schedule.id]);

    // 1. Play sound
    try {
      const audio = new Audio('/alarmmm.mpeg');
      audio.play().catch(e => console.warn("Audio playback blocked by browser until user interacts", e));
    } catch (e) {
      console.error("Failed to play audio", e);
    }

    // 2. Browser Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Time for your Medication!', {
        body: `It's time to take: ${schedule.medicineName}`,
        icon: '/favicon.ico',
      });
    }

    // 3. On-screen fallback/alert
    alert(`🚨 ALARM: It's time to take your medication: ${schedule.medicineName}`);
  };

  return null; // This is a background component, it renders nothing directly (except maybe a custom modal later instead of alert)
};

export default AlarmNotifier;
