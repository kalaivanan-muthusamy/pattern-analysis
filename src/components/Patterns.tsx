import { Card } from 'antd';

export default function Patterns({ data }) {
  return (
    <Card title="Patterns" style={{ maxHeight: '500px', overflow: 'auto' }}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Card>
  );
}
