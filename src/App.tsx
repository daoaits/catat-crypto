import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import TradesPage from './pages/TradesPage';
import NotebookPage from './pages/NotebookPage';
import LandingPage from './pages/LandingPage';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { CexAccountProvider } from './context/CexAccountContext';
import { apiService } from './services/apiService';

function AppContent() {
  const navigate = useNavigate();
  const { setPortfolioData, setUserName } = usePortfolio();
  const [step, setStep] = useState(() => Number(localStorage.getItem('app_step')) || 1);
  const [subStep, setSubStep] = useState(() => Number(localStorage.getItem('app_substep')) || 1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('user_form_data');
    return saved ? JSON.parse(saved) : {
      userId: '',
      name: '',
      email: '',
      password: '',
      traderType: '',
      gender: '',
      birthYear: '',
      goal: '',
      sources: [] as string[],
      plan: 'pro',
      broker: '',
      method: 'auto' as 'auto' | 'manual',
      apiKey: '',
      apiSecret: '',
      apiPassphrase: '',
      trade: {
        symbol: '',
        direction: 'Long',
        date: '2026-04-29',
        time: '14:30:00',
        quantity: '',
        price: '',
        commissions: '',
        fees: ''
      }
    };
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('user_form_data', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('app_step', step.toString());
  }, [step]);

  useEffect(() => {
    localStorage.setItem('app_substep', subStep.toString());
  }, [subStep]);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const updateTradeData = (data: Partial<typeof formData['trade']>) => {
    setFormData(prev => ({ 
      ...prev, 
      trade: { ...prev.trade, ...data } 
    }));
  };

  const nextStep = () => {
    if (step === 5 && subStep < 2) {
      setSubStep(prev => prev + 1);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step === 5 && subStep > 1) {
      setSubStep(prev => prev - 1);
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleRegister = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        email: formData.email
      })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    setUserName(formData.name);
    setStep(2);
  };

  const handleConnect = async () => {
    if (formData.method === 'auto') {
      if (!formData.apiKey || !formData.apiSecret || (formData.broker === 'bitget' && !formData.apiPassphrase)) {
        setConnectionError(formData.broker === 'bitget' ? 'Please enter API Key, Secret, and Passphrase' : 'Please enter both API Key and Secret');
        return;
      }
      setIsConnecting(true);
      setConnectionError('');

      try {
        // 1. Fetch data from Mock API
        const portfolioData = await apiService.connectBrokerAPI(
          formData.apiKey, 
          formData.apiSecret, 
          formData.broker,
          formData.apiPassphrase
        );
        
        // 2. Save data to Global Context
        setPortfolioData(portfolioData);

        // 3. Save onboarding data to backend
        let response;
        if (!formData.userId) {
          // New Registration: Create User + Profile
          response = await fetch('http://127.0.0.1:8000/api/register-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
              trader_type: formData.traderType,
              gender: formData.gender,
              birth_year: formData.birthYear,
              primary_goal: formData.goal,
              acquisition_sources: formData.sources,
              subscription_plan: formData.plan,
              broker: formData.broker,
              sync_method: formData.method,
              api_key: formData.apiKey,
              api_secret: formData.apiSecret,
              api_passphrase: formData.apiPassphrase,
            })
          });
        } else {
          // Existing User: Update Profile
          response = await fetch('http://127.0.0.1:8000/api/onboarding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              userId: formData.userId,
              trader_type: formData.traderType,
              gender: formData.gender,
              birth_year: formData.birthYear,
              primary_goal: formData.goal,
              acquisition_sources: formData.sources,
              subscription_plan: formData.plan,
              broker: formData.broker,
              sync_method: formData.method,
              api_key: formData.apiKey,
              api_secret: formData.apiSecret,
              api_passphrase: formData.apiPassphrase,
            })
          });
        }
        
        const data = await response.json();
        if (response.ok) {
           if (data.user) {
             updateFormData({ userId: data.user.id });
           }
           // Save token if returned from registration
           if (data.token) {
             localStorage.setItem('auth_token', data.token);
             updateFormData({ token: data.token });
           }
           navigate('/dashboard');
        } else {
           setConnectionError('Error: ' + (data.message || 'Validation failed'));
           setIsConnecting(false);
        }
      } catch (e: any) {
        setConnectionError(e.message || 'Network error. Is Laravel running?');
        setIsConnecting(false);
      }
    } else {
      // Manual Method - Still needs registration if no userId
      if (!formData.userId) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/register-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
              trader_type: formData.traderType,
              gender: formData.gender,
              birth_year: formData.birthYear,
              primary_goal: formData.goal,
              acquisition_sources: formData.sources,
              subscription_plan: formData.plan,
              broker: formData.broker,
              sync_method: formData.method,
            })
          });
          const data = await response.json();
          if (response.ok) {
            updateFormData({ userId: data.user.id });
            // Save token if returned from registration
            if (data.token) {
              localStorage.setItem('auth_token', data.token);
              updateFormData({ token: data.token });
            }
            navigate('/dashboard');
          } else {
            setConnectionError(data.message || 'Registration failed');
          }
        } catch (e: any) {
          setConnectionError(e.message || 'Network error');
        }
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleLogin = async (email: string, pass: string) => {
    try {
      const data = await apiService.login(email, pass);
      
      // Save token to localStorage for API calls
      localStorage.setItem('auth_token', data.token);
      
      updateFormData({ 
        userId: data.user.id, 
        name: data.user.name, 
        email: data.user.email,
        token: data.token
      });
      setUserName(data.user.name);

      if (data.profile) {
        // Restore profile to formData
        updateFormData({
          traderType: data.profile.trader_type,
          gender: data.profile.gender,
          birthYear: data.profile.birth_year,
          goal: data.profile.primary_goal,
          sources: data.profile.acquisition_sources,
          plan: data.profile.subscription_plan,
          broker: data.profile.broker,
          method: data.profile.sync_method,
          apiKey: data.profile.api_key,
          apiSecret: data.profile.api_secret,
          apiPassphrase: data.profile.api_passphrase || '',
        });

        // If they already have API keys, try to sync immediately
        if (data.profile.api_key && data.profile.api_secret) {
          setIsConnecting(true);
          try {
            const portData = await apiService.connectBrokerAPI(data.profile.api_key, data.profile.api_secret, data.profile.broker, data.profile.api_passphrase);
            setPortfolioData(portData);
            return '/dashboard';
          } catch (e) {
            console.error("Auto-sync failed on login:", e);
            return '/dashboard';
          } finally {
            setIsConnecting(false);
          }
        } else {
          setStep(5);
          return '/onboarding';
        }
      } else {
        setStep(2);
        return '/onboarding';
      }
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<LandingPage />} />
      <Route path="/contact" element={<LandingPage />} />
      <Route path="/privacy" element={<LandingPage />} />
      <Route path="/terms" element={<LandingPage />} />
      <Route 
        path="/register" 
        element={
          <AuthPage 
            formData={formData} 
            updateFormData={updateFormData} 
            handleRegister={handleRegister} 
            handleLogin={handleLogin}
          />
        } 
      />
      <Route 
        path="/onboarding" 
        element={
          <OnboardingPage 
            step={step}
            subStep={subStep}
            formData={formData}
            updateFormData={updateFormData}
            updateTradeData={updateTradeData}
            nextStep={nextStep}
            prevStep={prevStep}
            handleConnect={handleConnect}
            isConnecting={isConnecting}
            connectionError={connectionError}
          />
        } 
      />
      <Route 
        path="/dashboard" 
        element={<DashboardPage formData={formData} />} 
      />
      <Route 
        path="/reports" 
        element={<ReportsPage formData={formData} />} 
      />
      <Route 
        path="/trades" 
        element={<TradesPage formData={formData} />} 
      />
      <Route 
        path="/notebook" 
        element={<NotebookPage formData={formData} />} 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <CexAccountProvider>
        <Router>
          <AppContent />
        </Router>
      </CexAccountProvider>
    </PortfolioProvider>
  );
}
