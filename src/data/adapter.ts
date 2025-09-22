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
    const response = await fetch(`${API_BASE_URL}/risk-patients?include_ai_suggestions=false`);
    
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
      patientName: patient.name || patient.patient_name || 'Unknown Patient',
      risk: mapRiskLevel(patient.risk_level || patient.basic_risk?.risk_level),
      subject: generateSubject(patient),
      preview: generatePreview(patient),
      body: generateMessageBody(patient),
      createdAt: patient.updated_at || patient.created_at || new Date().toISOString(),
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
      createdAt: patient.updated_at || patient.created_at || new Date().toISOString(),
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
 * Generates a subject line based on patient risk data with pregnancy context
 */
function generateSubject(patient: any): string {
  const riskLevel = patient.risk_level || patient.basic_risk?.risk_level || patient.overall_assessment?.risk_level || 'low';
  const patientName = patient.name || patient.patient_name || 'Unknown Patient';
  const pregnancyWeeks = patient.pregnancy_weeks;
  const trimester = patient.trimester;
  
  // Create pregnancy context
  const pregnancyContext = pregnancyWeeks ? ` (${pregnancyWeeks} weeks, Trimester ${trimester})` : '';
  
  switch (riskLevel.toLowerCase()) {
    case 'high':
      return `${patientName}${pregnancyContext} - High heat risk detected - Immediate attention needed`;
    case 'medium':
      return `${patientName}${pregnancyContext} - Moderate heat risk - Monitor conditions`;
    default:
      return `${patientName}${pregnancyContext} - Routine heat monitoring update`;
  }
}

/**
 * Generates a preview text based on patient risk data with pregnancy context
 */
function generatePreview(patient: any): string {
  const riskLevel = patient.risk_level || patient.basic_risk?.risk_level || patient.overall_assessment?.risk_level || 'low';
  const concerns = patient.overall_assessment?.immediate_concerns || [];
  const pregnancyWeeks = patient.pregnancy_weeks;
  
  if (concerns.length > 0) {
    return `Pregnancy concerns: ${concerns.slice(0, 2).join(', ')}...`;
  }
  
  const pregnancyContext = pregnancyWeeks ? `${pregnancyWeeks} weeks pregnant` : 'pregnant patient';
  
  switch (riskLevel.toLowerCase()) {
    case 'high':
      return `${pregnancyContext} at high risk for heat-related complications. Immediate monitoring recommended.`;
    case 'medium':
      return `${pregnancyContext} in moderate risk zone. Monitor for heat stress and fetal well-being.`;
    default:
      return `${pregnancyContext} handling heat conditions well. Continue current precautions.`;
  }
}

/**
 * Generates detailed message body for comprehensive assessment with pregnancy data
 */
function generateDetailedMessageBody(patient: any): string {
  const patientName = patient.name || patient.patient_name || 'Unknown Patient';
  const patientId = patient.patient_id || 'Unknown ID';
  const riskLevel = patient.overall_assessment?.risk_level || patient.basic_risk?.risk_level || patient.risk_level || 'low';
  const concerns = patient.overall_assessment?.immediate_concerns || [];
  const recommendations = patient.recommendations || [];
  const aiSuggestions = patient.ai_suggestions || {};
  
  // Pregnancy information
  const pregnancyWeeks = patient.pregnancy_weeks;
  const trimester = patient.trimester;
  const pregnancyDescription = patient.pregnancy_description;
  const conditions = patient.conditions || [];
  const medications = patient.medications || [];
  
  let body = `Patient ${patientName} (ID: ${patientId}) - ${riskLevel.toUpperCase()} PREGNANCY RISK ASSESSMENT\n\n`;
  
  // Pregnancy details
  if (pregnancyWeeks) {
    body += `Pregnancy Information:\n`;
    body += `• Gestational Age: ${pregnancyWeeks} weeks (Trimester ${trimester})\n`;
    if (pregnancyDescription) {
      body += `• Pregnancy Status: ${pregnancyDescription}\n`;
    }
    body += '\n';
  }
  
  // Medical conditions
  if (conditions.length > 0) {
    body += `Medical Conditions:\n`;
    conditions.forEach((condition: string) => {
      body += `• ${condition}\n`;
    });
    body += '\n';
  }
  
  // Current medications
  if (medications.length > 0) {
    body += `Current Medications:\n`;
    medications.forEach((med: string) => {
      body += `• ${med}\n`;
    });
    body += '\n';
  }
  
  // Immediate concerns
  if (concerns.length > 0) {
    body += `Immediate Concerns:\n`;
    concerns.forEach((concern: string) => {
      body += `• ${concern}\n`;
    });
    body += '\n';
  }
  
  // Recommendations
  if (recommendations.length > 0) {
    body += `Recommendations:\n`;
    recommendations.forEach((rec: string) => {
      body += `• ${rec}\n`;
    });
    body += '\n';
  }
  
  // AI suggestions
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
 * Generates basic message body for list view with pregnancy context
 */
function generateMessageBody(patient: any): string {
  const patientName = patient.name || patient.patient_name || 'Unknown Patient';
  const patientId = patient.patient_id || 'Unknown ID';
  const riskLevel = patient.risk_level || patient.basic_risk?.risk_level || 'low';
  const concerns = patient.overall_assessment?.immediate_concerns || [];
  const pregnancyWeeks = patient.pregnancy_weeks;
  const trimester = patient.trimester;
  
  let body = `Patient ${patientName} (ID: ${patientId}) has been assessed for heat-related health risks during pregnancy.\n\n`;
  
  // Add pregnancy context
  if (pregnancyWeeks) {
    body += `Pregnancy Status: ${pregnancyWeeks} weeks (Trimester ${trimester})\n\n`;
  }
  
  if (concerns.length > 0) {
    body += `Current pregnancy concerns include: ${concerns.slice(0, 3).join(', ')}.\n\n`;
  }
  
  switch (riskLevel.toLowerCase()) {
    case 'high':
      body += 'Pregnancy Risk Level: HIGH - Heat exposure can increase risk of preterm labor, birth defects, and dehydration. Immediate attention recommended.\n\n';
      break;
    case 'medium':
      body += 'Pregnancy Risk Level: MEDIUM - Monitor for signs of dehydration, overheating, and fetal distress. Avoid prolonged heat exposure.\n\n';
      break;
    default:
      body += 'Pregnancy Risk Level: LOW - Continue current hydration, sun protection, and heat avoidance measures. Monitor for any changes in fetal movement.\n\n';
  }
  
  body += `This message was sent by Dr. Fitzpatrick's AI assistant. Please complete the condition assessment below.`;
  
  return body;
}

/**
 * Fetch weather data for a specific location
 */
export async function getWeatherData(locationCode: string = '101000'): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/weather-onecall/${locationCode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API returned error');
    }
    
    return data.weather;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return null on error - components can handle fallback
    return null;
  }
}

/**
 * Fetch AI weather risk analysis
 */
export async function getWeatherRiskAnalysis(locationCode: string = '101000'): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/weather-ai-analysis/${locationCode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API returned error');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching weather risk analysis:', error);
    return null;
  }
}

/**
 * Fetch environment metrics for all patients
 */
export async function getEnvironmentMetrics(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/environment-metrics`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API returned error');
    }
    
    return data.environment_metrics;
  } catch (error) {
    console.error('Error fetching environment metrics:', error);
    return null;
  }
}

/**
 * Fetch all patients with pagination
 * This is used for the Patient Information widget in the Doctor Dashboard
 */
export async function getAllPatients(page: number = 1, perPage: number = 10): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients?page=${page}&per_page=${perPage}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API returned error');
    }
    
    return {
      patients: data.patients || [],
      total: data.total || 0,
      pages: data.pages || 1,
      currentPage: data.current_page || page
    };
  } catch (error) {
    console.error('Error fetching all patients:', error);
    return {
      patients: [],
      total: 0,
      pages: 1,
      currentPage: 1
    };
  }
}

/**
 * Stream all patients with comprehensive risk data
 * This uses the streaming API for handling large datasets efficiently
 */
export async function streamAllPatients(
  onBatch: (patients: any[], processedCount: number, totalPatients: number) => void,
  onMetadata: (metadata: any) => void,
  onSummary: (summary: any) => void,
  onError: (error: string) => void,
  options: {
    riskLevel?: 'low' | 'medium' | 'high';
    location?: string;
    batchSize?: number;
    includeAiSuggestions?: boolean;
    includeNotifications?: boolean;
  } = {}
): Promise<void> {
  try {
    const params = new URLSearchParams();
    
    if (options.riskLevel) params.append('risk_level', options.riskLevel);
    if (options.location) params.append('location', options.location);
    if (options.batchSize) params.append('batch_size', options.batchSize.toString());
    if (options.includeAiSuggestions !== undefined) params.append('include_ai_suggestions', options.includeAiSuggestions.toString());
    if (options.includeNotifications !== undefined) params.append('include_notifications', options.includeNotifications.toString());
    
    const url = `${API_BASE_URL}/patients/with-risks/stream${params.toString() ? '?' + params.toString() : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    if (!response.body) {
      throw new Error('Response body is null');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            
            switch (data.type) {
              case 'metadata':
                onMetadata(data);
                break;
              case 'batch':
                onBatch(data.patients || [], data.processed_count || 0, data.total_patients || 0);
                break;
              case 'summary':
                onSummary(data);
                break;
              case 'error':
                onError(data.error || 'Unknown streaming error');
                break;
              default:
                console.warn('Unknown streaming message type:', data.type);
            }
          } catch (parseError) {
            console.error('Error parsing streaming data:', parseError, 'Line:', line);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in streaming patients:', error);
    onError(error instanceof Error ? error.message : 'Unknown streaming error');
  }
}

/**
 * Fetch patient survey completion notifications
 * This would be called when patients complete their condition assessments
 */
export async function getPatientNotifications(): Promise<any[]> {
  try {
    // In a real implementation, this would be a dedicated notifications endpoint
    // For now, we'll use the risk-patients endpoint and simulate notifications
    const response = await fetch(`${API_BASE_URL}/risk-patients?include_ai_suggestions=true`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('API returned error');
    }
    
    // Transform patient data into notification format
    const notifications = data.risk_patients?.map((patient: any, index: number) => ({
      id: `notification-${patient.patient_id || index}`,
      patientId: patient.patient_id?.toString() || index.toString(),
      patientName: patient.name || patient.patient_name || 'Unknown Patient',
      risk: mapRiskLevel(patient.risk_level || patient.basic_risk?.risk_level),
      type: 'survey_completed',
      message: `Pregnant patient completed condition assessment (${patient.pregnancy_weeks ? `${patient.pregnancy_weeks} weeks, ` : ''}Risk Level: ${patient.risk_level || patient.basic_risk?.risk_level || 'Unknown'})`,
      timestamp: new Date(Date.now() - Math.random() * 60 * 60 * 1000), // Random time within last hour
      priority: (patient.risk_level || patient.basic_risk?.risk_level || 'low').toLowerCase(),
      status: Math.random() > 0.5 ? 'read' : 'unread' // Random read status
    })) || [];
    
    return notifications;
  } catch (error) {
    console.error('Error fetching patient notifications:', error);
    return [];
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
      patientName: 'Sarah Williams',
      risk: 'high',
      subject: 'Sarah Williams - High heat risk detected - Immediate attention needed',
      preview: 'Pregnant patient at high risk for heat-related complications. Immediate monitoring recommended.',
      body: 'Patient Sarah Williams (ID: 12345) has been assessed for heat-related health risks during pregnancy.\n\nCurrent concerns include: Extreme heat wave conditions, Elevated body temperature, Dehydration risk.\n\nPregnancy Risk Level: HIGH - Heat exposure can increase risk of preterm labor, birth defects, and dehydration. Immediate attention recommended.\n\nThis message was sent by Dr. Fitzpatrick\'s AI assistant. Please complete the condition assessment below.',
      createdAt: oneHourAgo.toISOString(),
      read: false
    },
    {
      id: '2',
      patientName: 'Maria Garcia',
      risk: 'medium',
      subject: 'Maria Garcia - Moderate heat risk - Monitor conditions',
      preview: 'Pregnant patient in moderate risk zone. Continue monitoring and precautions.',
      body: 'Patient Maria Garcia (ID: 67890) has been assessed for heat-related health risks during pregnancy.\n\nCurrent concerns include: High humidity levels, Outdoor activity exposure, Heat stress symptoms.\n\nPregnancy Risk Level: MEDIUM - Monitor for signs of dehydration, overheating, and fetal distress. Avoid prolonged heat exposure.\n\nThis message was sent by Dr. Fitzpatrick\'s AI assistant. Please complete the condition assessment below.',
      createdAt: twoHoursAgo.toISOString(),
      read: true
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      risk: 'low',
      subject: 'Emily Davis - Routine heat monitoring update',
      preview: 'Pregnant patient handling heat conditions well. Continue current precautions.',
      body: 'Patient Emily Davis (ID: 11111) has been assessed for heat-related health risks during pregnancy.\n\nPregnancy Risk Level: LOW - Continue current hydration, sun protection, and heat avoidance measures. Monitor for any changes in fetal movement.\n\nThis message was sent by Dr. Fitzpatrick\'s AI assistant. Please complete the condition assessment below.',
      createdAt: threeHoursAgo.toISOString(),
      read: false
    }
  ];
}
