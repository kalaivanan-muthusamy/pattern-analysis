import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analysis from "./pages/analysis";
import { Layout } from "antd";
import { Signals } from "./pages/signals";
import TopNav from "./components/header";

const { Content, Footer } = Layout;

function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_URL || '/'}>
      <Layout>
        <TopNav />
        <Content style={{ padding: '24px 48px' }}>
          <Routes>
            <Route path="/" >
              <Route index element={<Analysis />} />
              <Route path="/analysis" element={<Analysis />} />
            </Route>
            <Route path="/signal" element={<Signals />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          TradingWinds Analytics ©{new Date().getFullYear()} Created by Kalai
        </Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
