import { Toaster } from 'react-hot-toast';
import './App.css';
import Home from './Components/Home/Home';

function App() {
  return (
    <div className="App">
      <Home/>
      <Toaster />
    </div>
  );
}

export default App;
