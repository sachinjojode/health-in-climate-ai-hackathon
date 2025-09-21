import { Message } from '../types';

/**
 * Data adapter for Health Notifier
 * 
 * This file contains API functions that connect to the backend health monitoring system.
 * Backend URL: http://10.57.1.173:5000/api
 */

// Base URL for the backend API
const API_BASE_URL = 'http://10.57.1.173:5000/api';

/**
 * Fetch all messages for the inbox from risk-patients endpoint
 * Transforms patient risk data into message format
 */
export async function listMessages(): Promise<Message[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/risk-patients?include_ai_suggestions=true`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API returned error');
    }
    
    // Transform patient risk data to Message format
    const messages: Message[] = data.risk_patients?.map((patient: any, index: number) => ({
      id: patient.patient_id?.toString() || index.toString(),
      patientName: patient.patient_name || 'Unknown Patient',
      risk: mapRiskLevel(patient.risk_level || patient.basic_risk?.risk_level),
      subject: generateSubject(patient),
      preview: generatePreview(patient),
      body: generateMessageBody(patient),
      createdAt: new Date().toISOString(), // Use current time as we don't have timestamp from API
      read: false
    })) || [];
    
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    // Return empty array on error
    return [];
  }
}

/**
 * Fetch a specific message by ID using comprehensive risk assessment
 */
export async function getMessage(id: string): Promise<Message | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/risk-patients/${id}/comprehensive`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API returned error');
    }
    
    const patient = data.comprehensive_assessment;
    
    return {
      id: patient.patient_id?.toString() || id,
      patientName: patient.patient_name || 'Unknown Patient',
      risk: mapRiskLevel(patient.overall_assessment?.risk_level || patient.basic_risk?.risk_level),
      subject: generateSubject(patient),
      preview: generatePreview(patient),
      body: generateDetailedMessageBody(patient),
      createdAt: new Date().toISOString(),
      read: false
    };
  } catch (error) {
    console.error(`Error fetching message ${id}:`, error);
    return null;
  }
}

/**
 * Mark a message as read/unread
 * Note: This is a frontend-only operation since the backend doesn't have read status
 */
export async function markRead(id: string): Promise<void> {
  // Since the backend doesn't track read status, we'll just log it
  // In a real implementation, you might store this in localStorage or a separate service
  console.log(`Marking message ${id} as read`);
  
  // Store read status in localStorage for persistence
  const readMessages = JSON.parse(localStorage.getItem('readMessages') || '[]');
  if (!readMessages.includes(id)) {
    readMessages.push(id);
    localStorage.setItem('readMessages', JSON.stringify(readMessages));
  }
}

/**
 * Request a call for a specific message
 * Note: This would integrate with a call scheduling system in a real implementation
 */
export async function requestCall(messageId: string): Promise<void> {
  try {
    // In a real implementation, this would call a call scheduling API
    // For now, we'll simulate the request
    console.log(`Requesting call for patient ${messageId}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Store call request in localStorage for demo purposes
    const callRequests = JSON.parse(localStorage.getItem('callRequests') || '[]');
    callRequests.push({
      messageId,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('callRequests', JSON.stringify(callRequests));
    
  } catch (error) {
    console.error(`Error requesting call for ${messageId}:`, error);
    throw error;
  }
}

// Helper functions to transform API data

/**
 * Maps API risk levels to our frontend risk levels
 */
function mapRiskLevel(apiRiskLevel: string): 'low' | 'medium' | 'high' {
  if (!apiRiskLevel) return 'low';
  
  const level = apiRiskLevel.toLowerCase();
  if (level === 'high') return 'high';
  if (level === 'medium') return 'medium';
  return 'low';
}

/**
 * Generates a subject line based on patient risk data
 */
function generateSubject(patient: any): string {
  const riskLevel = patient.basic_risk?.risk_level || patient.overall_assessment?.risk_level || 'low';
  const patientName = patient.patient_name || 'Unknown Patient';
  
  switch (riskLevel.toLowerCase()) {
    case 'high':
      return `${patientName} - High heat risk detected - Immediate attention needed`;
    case 'medium':
      return `${patientName} - Moderate heat risk - Monitor conditions`;
    default:
      return `${patientName} - Routine heat monitoring update`;
  }
}

/**
 * Generates a preview text based on patient risk data
 */
function generatePreview(patient: any): string {
  const riskLevel = patient.basic_risk?.risk_level || patient.overall_assessment?.risk_level || 'low';
  const concerns = patient.overall_assessment?.immediate_concerns || [];
  
  if (concerns.length > 0) {
    return `Patient concerns: ${concerns.slice(0, 2).join(', ')}...`;
  }
  
  switch (riskLevel.toLowerCase()) {
    case 'high':
      return 'Patient at high risk for heat-related illness. Immediate monitoring recommended.';
    case 'medium':
      return 'Patient in moderate risk zone. Continue monitoring and precautions.';
    default:
      return 'Patient handling heat conditions well. Continue current precautions.';
  }
}

/**
 * Generates detailed message body for comprehensive assessment
 */
function generateDetailedMessageBody(patient: any): string {
  const patientName = patient.patient_name || 'Unknown Patient';
  const patientId = patient.patient_id || 'Unknown ID';
  const riskLevel = patient.overall_assessment?.risk_level || patient.basic_risk?.risk_level || 'low';
  const concerns = patient.overall_assessment?.immediate_concerns || [];
  const recommendations = patient.recommendations || [];
  const aiSuggestions = patient.ai_suggestions || {};
  
  let body = `Patient ${patientName} (ID: ${patientId}) - ${riskLevel.toUpperCase()} RISK ASSESSMENT\n\n`;
  
  if (concerns.length > 0) {
    body += `Immediate Concerns:\n`;
    concerns.forEach((concern: string) => {
      body += `• ${concern}\n`;
    });
    body += '\n';
  }
  
  if (recommendations.length > 0) {
    body += `Recommendations:\n`;
    recommendations.forEach((rec: string) => {
      body += `• ${rec}\n`;
    });
    body += '\n';
  }
  
  if (aiSuggestions.immediate_actions && aiSuggestions.immediate_actions.length > 0) {
    body += `Immediate Actions:\n`;
    aiSuggestions.immediate_actions.forEach((action: string) => {
      body += `• ${action}\n`;
    });
    body += '\n';
  }
  
  if (aiSuggestions.emergency_signs && aiSuggestions.emergency_signs.length > 0) {
    body += `Emergency Signs to Watch For:\n`;
    aiSuggestions.emergency_signs.forEach((sign: string) => {
      body += `• ${sign}\n`;
    });
    body += '\n';
  }
  
  body += `This assessment was generated by Dr. Fitzpatrick's AI monitoring system. Please use the assessment tool below to rate your current condition.`;
  
  return body;
}

/**
 * Generates basic message body for list view
 */
function generateMessageBody(patient: any): string {
  const patientName = patient.patient_name || 'Unknown Patient';
  const patientId = patient.patient_id || 'Unknown ID';
  const riskLevel = patient.basic_risk?.risk_level || 'low';
  const concerns = patient.overall_assessment?.immediate_concerns || [];
  
  let body = `Patient ${patientName} (ID: ${patientId}) has been assessed for heat-related health risks.\n\n`;
  
  if (concerns.length > 0) {
    body += `Current concerns include: ${concerns.slice(0, 3).join(', ')}.\n\n`;
  }
  
  switch (riskLevel.toLowerCase()) {
    case 'high':
      body += 'Risk Level: HIGH - Immediate attention recommended. Monitor closely for any symptom changes.\n\n';
      break;
    case 'medium':
      body += 'Risk Level: MEDIUM - Continue monitoring and follow recommended precautions.\n\n';
      break;
    default:
      body += 'Risk Level: LOW - Continue current hydration and sun protection measures.\n\n';
  }
  
  body += `This message was sent by Dr. Fitzpatrick's AI assistant. Please complete the condition assessment below.`;
  
  return body;
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
      subject: 'John Smith - High heat risk detected - Immediate attention needed',
      preview: 'Patient at high risk for heat-related illness. Immediate monitoring recommended.',
      body: 'Patient John Smith (ID: 12345) has been assessed for heat-related health risks.\n\nCurrent concerns include: Extreme heat wave conditions, Elevated heart rate.\n\nRisk Level: HIGH - Immediate attention recommended. Monitor closely for any symptom changes.\n\nThis message was sent by Dr. Fitzpatrick\'s AI assistant. Please complete the condition assessment below.',
      createdAt: oneHourAgo.toISOString(),
      read: false
    },
    {
      id: '2',
      patientName: 'Maria Garcia',
      risk: 'medium',
      subject: 'Maria Garcia - Moderate heat risk - Monitor conditions',
      preview: 'Patient in moderate risk zone. Continue monitoring and precautions.',
      body: 'Patient Maria Garcia (ID: 67890) has been assessed for heat-related health risks.\n\nCurrent concerns include: High humidity levels, Outdoor activity exposure.\n\nRisk Level: MEDIUM - Continue monitoring and follow recommended precautions.\n\nThis message was sent by Dr. Fitzpatrick\'s AI assistant. Please complete the condition assessment below.',
      createdAt: twoHoursAgo.toISOString(),
      read: true
    },
    {
      id: '3',
      patientName: 'David Johnson',
      risk: 'low',
      subject: 'David Johnson - Routine heat monitoring update',
      preview: 'Patient handling heat conditions well. Continue current precautions.',
      body: 'Patient David Johnson (ID: 11111) has been assessed for heat-related health risks.\n\nRisk Level: LOW - Continue current hydration and sun protection measures.\n\nThis message was sent by Dr. Fitzpatrick\'s AI assistant. Please complete the condition assessment below.',
      createdAt: threeHoursAgo.toISOString(),
      read: false
    }
  ];
}
