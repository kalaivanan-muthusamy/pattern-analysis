import { Card } from 'antd';

export default function ProcessedCandles({ data }: { data: any }) {
  return (
    <Card title="JSON Data" style={{ maxHeight: '500px', overflow: 'auto' }}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Card>
  );
}
