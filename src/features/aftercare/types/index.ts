
export interface AftercareTemplate {
  id: string;
  user_id: string;
  name: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AftercareSchedule {
  id: string;
  user_id: string;
  sale_id: string;
  client_id: string;
  template_id: string;
  scheduled_at: string;
  sent_at?: string;
  status: 'scheduled' | 'sent' | 'failed';
  created_at: string;
}

export interface AftercareFormData {
  name: string;
  title: string;
  content: string;
  is_active: boolean;
}
