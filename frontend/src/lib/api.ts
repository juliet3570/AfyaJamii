const API_BASE_URL = 'https://afyajamii.onrender.com';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  account_type: 'pregnant' | 'postnatal' | 'general';
  full_name: string;
  password: string;
}

export interface VitalsData {
  age: number;
  systolic_bp: number;
  diastolic_bp: number;
  bs: number;
  body_temp: number;
  body_temp_unit: 'celsius' | 'fahrenheit';
  heart_rate: number;
  patient_history: string;
}

export interface VitalsSubmitPayload {
  vitals: VitalsData;
  account_type: 'pregnant' | 'postnatal' | 'general';
}

export interface VitalsResponse {
  id: number;
  user_id: number;
  age: number;
  systolic_bp: number;
  diastolic_bp: number;
  bs: number;
  body_temp: number;
  body_temp_unit: string;
  heart_rate: number;
  patient_history: string;
  ml_risk_label: string;
  ml_probability: number;
  ml_feature_importances: string | Record<string, number>;
  created_at: string;
}

export interface VitalsSubmitResponse {
  user_id: number;
  submission_id: number;
  timestamp: string;
  ml_output: {
    risk_label: string;
    probability: number;
    feature_importances: Record<string, number>;
  };
  llm_advice: {
    advice: string;
    timestamp: string;
  };
}

export interface ConversationResponse {
  id: number;
  user_id: number;
  vitals_record_id: number;
  user_message: string;
  ai_response: string;
  created_at: string;
}

export interface ChatResponse {
  advice: string;
  timestamp: string;
}

export const api = {
  async login(credentials: LoginCredentials): Promise<{ token: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    // Handle both 'token' and 'access_token' field names
    return { token: data.token || data.access_token };
  },

  async signup(data: SignupData): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Signup failed' }));
      throw new Error(error.detail || 'Signup failed');
    }

    return response.json();
  },

  async submitVitals(payload: VitalsSubmitPayload, token: string): Promise<VitalsSubmitResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/vitals/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to submit vitals' }));
      throw new Error(error.detail || 'Failed to submit vitals');
    }

    return response.json();
  },

  async chatAdvice(question: string, token: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat/advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to get advice' }));
      throw new Error(error.detail || 'Failed to get advice');
    }

    return response.json();
  },

  async getVitalsHistory(token: string, limit: number = 10): Promise<VitalsResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/history/vitals?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch vitals history' }));
      throw new Error(error.detail || 'Failed to fetch vitals history');
    }

    return response.json();
  },

  async getConversationsHistory(token: string, limit: number = 10): Promise<ConversationResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/history/conversations?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch conversations history' }));
      throw new Error(error.detail || 'Failed to fetch conversations history');
    }

    return response.json();
  },
};
