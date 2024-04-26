import { Card } from 'antd';

export default function JSONData({ data }) {
  return (
    <Card title="JSON Data" style={{ maxHeight: '500px', overflow: 'auto' }}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Card>
  );
}
