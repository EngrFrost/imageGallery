import { App as AntApp } from 'antd';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { messageApi } from './utils/messageHelper';
import './App.css';

const AppContent = () => {
  const staticFunction = AntApp.useApp();
  useEffect(() => {
    messageApi.current = staticFunction.message;
  }, [staticFunction.message]);

  return (
    <main>
      <Outlet />
    </main>
  );
};

function App() {
  return (
    <AntApp>
      <AppContent />
    </AntApp>
  );
}

export default App;
