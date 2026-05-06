export interface Trade {
  id: string;
  asset: string;
  type: string;
  entry: string;
  size: string;
  pnl: string;
  percent: string;
  duration: string;
  positive: boolean;
}

export interface DailyPerformance {
  date: string;
  dayName: string;
  realized: string;
  realizedValue: number;
  tradesCount: number;
  positive: boolean;
  neutral: boolean;
}

export interface PortfolioData {
  totalBalance: string;
  netPnl: string;
  netPnlPercent: string;
  netPnlPositive: boolean;
  dayWinRate: string;
  dayWinRateSub: string;
  tradeWinRate: string;
  tradeWinRateSub: string;
  avgWinLoss: string;
  rrRatio: string;
  activeDeployments: Trade[];
  performance: DailyPerformance[];
}

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  /**
   * Connects to a broker API via the Laravel backend proxy.
   * Uses specific endpoint per exchange for better clarity and debugging.
   */
  async connectBrokerAPI(apiKey: string, apiSecret: string, brokerId: string, apiPassphrase?: string): Promise<PortfolioData> {
    if (!apiKey || !apiSecret) {
      throw new Error("Invalid API keys provided.");
    }

    // Map broker ID to specific endpoint
    const endpointMap: Record<string, string> = {
      'binance': 'http://127.0.0.1:8000/api/sync/binance',
      'bybit': 'http://127.0.0.1:8000/api/sync/bybit',
      'okx': 'http://127.0.0.1:8000/api/sync/okx',
      'mexc': 'http://127.0.0.1:8000/api/sync/mexc',
      'bitget': 'http://127.0.0.1:8000/api/sync/bitget',
      'indodax': 'http://127.0.0.1:8000/api/sync/indodax',
      'tokocrypto': 'http://127.0.0.1:8000/api/sync/tokocrypto',
    };

    const endpoint = endpointMap[brokerId.toLowerCase()];
    
    if (!endpoint) {
      throw new Error(`Exchange "${brokerId}" is not supported yet. Currently supported: Binance, Bybit, OKX, MEXC, Bitget, Indodax, Tokocrypto.`);
    }

    const payload: any = {
      api_key: apiKey,
      api_secret: apiSecret
    };

    if (apiPassphrase) {
      payload.api_passphrase = apiPassphrase;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to sync with ${brokerId}.`);
    }

    return await response.json();
  },

  async login(email: string, password: string): Promise<any> {
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed.');
    }

    return await response.json();
  },

  /**
   * Get journal entries for a specific month
   */
  async getJournals(year: number, month: number, token: string, cexAccountId?: number): Promise<any> {
    let url = `http://127.0.0.1:8000/api/journals?year=${year}&month=${month}`;
    if (cexAccountId) {
      url += `&cex_account_id=${cexAccountId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch journals.');
    }

    return await response.json();
  },

  /**
   * Get journal entry for a specific date
   */
  async getJournal(date: string, token: string, cexAccountId?: number): Promise<any> {
    let url = `http://127.0.0.1:8000/api/journal?date=${date}`;
    if (cexAccountId) {
      url += `&cex_account_id=${cexAccountId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch journal.');
    }

    return await response.json();
  },

  /**
   * Save journal entry
   */
  async saveJournal(data: {
    cex_account_id: number;
    trade_date: string;
    remarks?: string;
    screenshots?: string[];
    mood?: string;
    pnl?: number;
    trades_count?: number;
  }, token: string): Promise<any> {
    const response = await fetch('http://127.0.0.1:8000/api/journal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save journal.');
    }

    return await response.json();
  },

  /**
   * Delete journal entry
   */
  async deleteJournal(date: string, token: string, cexAccountId?: number): Promise<any> {
    let url = `http://127.0.0.1:8000/api/journal?date=${date}`;
    if (cexAccountId) {
      url += `&cex_account_id=${cexAccountId}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete journal.');
    }

    return await response.json();
  }
};
