export type HeatRisk = 'low' | 'medium' | 'high';

export interface Message {
  id: string;
  patientName: string;
  risk: HeatRisk;
  subject: string;
  preview: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export type FilterType = 'all' | 'unread' | 'low' | 'medium' | 'high';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}
