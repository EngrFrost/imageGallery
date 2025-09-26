import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      {/* This could be a layout component with header, footer, etc. */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
