import { Message } from '../types';

/**
 * Data adapter for Health Notifier
 * 
 * This file connects to the Flask backend API endpoints.
 * Make sure the backend is running on http://localhost:5000
 */

// Base API URL - change this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:5000/api';

// For demo purposes, we'll use a hardcoded patient ID
// In a real app, this would come from user authentication
const DEMO_PATIENT_ID = 1;

/**
 * Fetch all notifications for the inbox
 * Calls the backend API: GET /api/notifications/{patient_id}
 */
export async function listMessages(): Promise<Message[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${DEMO_PATIENT_ID}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch notifications');
    }
    
    // Transform backend notifications to frontend Message format
    return data.notifications.map((notification: any) => ({
      id: notification.id.toString(),
      patientName: `Patient ${notification.patient_id}`, // We'll get actual name from patient API
      risk: notification.risk_level as 'low' | 'medium' | 'high',
      subject: `${notification.notification_type.replace('_', ' ')} Alert`,
      preview: notification.message.substring(0, 100) + (notification.message.length > 100 ? '...' : ''),
      body: notification.message,
      createdAt: notification.sent_at,
      read: notification.read_status
    }));
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    
    // Return empty array if backend is not available
    // This allows the frontend to work even without backend
    return [];
  }
}

/**
 * Fetch a specific notification by ID
 * Calls the backend API: GET /api/notifications/{patient_id}
 */
export async function getMessage(id: string): Promise<Message | null> {
  try {
    // Get all notifications and find the one with matching ID
    const messages = await listMessages();
    return messages.find(msg => msg.id === id) || null;
    
  } catch (error) {
    console.error('Error fetching message:', error);
    return null;
  }
}

/**
 * Mark a notification as read
 * Calls the backend API: POST /api/notifications/mark-read/{notification_id}
 */
export async function markRead(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-read/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to mark notification as read');
    }
    
    console.log(`Message ${id} marked as read successfully`);
    
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error; // Re-throw to let the UI handle the error
  }
}

/**
 * Request a call for a specific message
 * This is a placeholder function since the backend doesn't have a call request API yet
 * You can implement this by adding a new API endpoint in the backend
 */
export async function requestCall(messageId: string): Promise<void> {
  try {
    // For now, we'll just log the request
    // TODO: Implement actual call request API endpoint in backend
    console.log(`Call request for message ${messageId} - would trigger emergency contact`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would call something like:
    // await fetch(`${API_BASE_URL}/emergency/request-call`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ messageId, patientId: DEMO_PATIENT_ID })
    // });
    
  } catch (error) {
    console.error('Error requesting call:', error);
    throw error;
  }
}

/**
 * DEVELOPMENT ONLY: Load sample data for testing UI
 * This function is only used when the dev button is enabled
 * Remove this function in production
 */
export function loadSampleData(): Message[] {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  return [
    {
      id: '1',
      patientName: 'John Smith',
      risk: 'high',
      subject: 'Heat stroke symptoms detected',
      preview: 'Patient showing signs of heat exhaustion and dehydration...',
      body: 'Patient John Smith (ID: 12345) has been exhibiting symptoms consistent with heat stroke during today\'s outdoor activities. Temperature readings show 102.3°F with elevated heart rate. Immediate attention recommended. Please contact patient or emergency services if symptoms worsen.',
      createdAt: oneHourAgo.toISOString(),
      read: false
    },
    {
      id: '2',
      patientName: 'Maria Garcia',
      risk: 'medium',
      subject: 'Heat advisory warning',
      preview: 'Patient in moderate risk zone for heat-related illness...',
      body: 'Maria Garcia (ID: 67890) is currently in a moderate risk zone for heat-related illness. Environmental conditions are reaching dangerous levels. Recommend reducing outdoor activity and increasing fluid intake. Monitor closely for any symptom changes.',
      createdAt: twoHoursAgo.toISOString(),
      read: true
    },
    {
      id: '3',
      patientName: 'David Johnson',
      risk: 'low',
      subject: 'Routine heat monitoring update',
      preview: 'Patient handling heat well, continue current precautions...',
      body: 'David Johnson (ID: 11111) is handling the current heat conditions well. All vitals are within normal ranges. Continue current hydration and sun protection measures. Next check-in scheduled for 4 hours.',
      createdAt: threeHoursAgo.toISOString(),
      read: false
    }
  ];
}
