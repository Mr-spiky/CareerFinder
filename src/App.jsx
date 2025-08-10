import { Routes, Route } from 'react-router-dom';
import Form from "./pages/Form";
import Home from './pages/Home';
import Results from './pages/Results';
import About from './pages/About';
import Navbar from "./components/Navbar";
import NotFound from './pages/NotFound'; // Create this for 404 pages

function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/result" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;