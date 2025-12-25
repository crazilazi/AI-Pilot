import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ChatInterface from './components/ChatInterface';
import './styles/animations.css';

const App: React.FC = () => {
  useEffect(() => {
    // Check if API key is configured
    const apiKey = process.env.AI_PROVIDER_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ AI_PROVIDER_API_KEY not configured!');
      console.info('ℹ️ Please set AI_PROVIDER_API_KEY in your .env file');
      console.info('ℹ️ Configure AI providers via the 🔧 AI Providers button in the UI');
    } else {
      console.log('✅ API key configured');
      console.info('ℹ️ Configure providers and models via 🔧 AI Providers');
      console.info('ℹ️ Configure agents via 🤖 Manage Agents');
    }
  }, []);

  return (
    <Provider store={store}>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <ChatInterface />
      </div>
    </Provider>
  );
};

export default App;
