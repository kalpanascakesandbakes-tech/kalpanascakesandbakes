import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import CustomizedCake from './pages/CustomizedCake';
import BulkOrder from './pages/BulkOrder';
import Checkout from './pages/Checkout';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="cake/:id" element={<ProductDetail />} />
          <Route path="custom-cake" element={<CustomizedCake />} />
          <Route path="bulk-order" element={<BulkOrder />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
