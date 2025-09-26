import './App.css';
import { Footer, Header } from './components/index';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-primary'>
      <Header />
      <main className='w-full flex-grow pt-20'> 
        <div className='container mx-auto'>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;