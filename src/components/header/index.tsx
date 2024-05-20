import { FundOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";


const items = [
    {
        key: 'analysis',
        path: ['', '/analysis'],
        label: <Link to='/analysis'>Analysis</Link>
    },
    {
        key: 'signal',
        path: '/signal',
        label: <Link to='/signal'>Signal</Link>
    }
];

export default function TopNav() {
    const [selectedMenu, setSelectedMenu] = useState('analysis');
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        const match = items.find(item => Array.isArray(item.path) ? item.path.includes(pathname) : item.path === pathname);
        if (match) {
            setSelectedMenu(match.key)
        }
    }, [location])

    return (
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className="logo"><h2><FundOutlined />Crypto Analysis</h2></div>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[selectedMenu]}
                items={items}
                style={{ flex: 1, minWidth: 0 }}
            />
        </Header>
    )
}