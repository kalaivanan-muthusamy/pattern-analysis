import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Analysis from "./pages/analysis";
import { Layout, Menu } from "antd";


const { Header, Content, Footer } = Layout;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Analysis />,
  },
]);

const items = [
  {
    key: 'analysis',
    label: 'Analysis'
  },
  {
    key: 'signal',
    label: 'Signal'
  }
];

function App() {
  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="color-white"><h2>TradingWinds Analytics</h2></div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <RouterProvider router={router} />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default App;
