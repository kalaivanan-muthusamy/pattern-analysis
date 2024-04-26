import {
  Input,
  Row,
  Col,
  Form,
  DatePicker,
  Select,
  Button,
  Layout,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import { useEffect, useState } from 'react';
import JSONData from './components/JSONData';
import axios from 'axios';
import Chart from './components/Chart';
import Patterns from './components/Patterns';
import { formatCandle } from './modules/candle';

const { RangePicker } = DatePicker;

function App() {
  const [formValue, setFormValue] = useState({
    interval: '8h',
    symbol: 'BTCUSDT',
    timerange: null,
  });
  const [ohlc, setOHLC] = useState(null);

  function onFormInputChange(type, e) {
    setFormValue((current) => ({ ...current, [type]: e.target.value }));
  }

  useEffect(() => {
    console.log(formatCandle);
  },[])

  async function onFinish() {
    const startTime = formValue.timerange?.[0]?.valueOf();
    const endTime = formValue.timerange?.[1]?.valueOf();
    const res = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol: formValue.symbol,
        interval: formValue.interval,
        startTime,
        endTime,
        limit: 100,
      },
    });
    setOHLC(res.data || []);
  }

  return (
    <Layout>
      <Content style={{ padding: '24px 24px' }}>
        <Title>Pattern Analysis</Title>
        <Row>
          <Col>
            <Form layout="inline" onFinish={onFinish}>
              <Form.Item label="Symbol">
                <Input
                  placeholder="BTCUSDT"
                  value={formValue.symbol}
                  onChange={(e) => onFormInputChange('symbol', e)}
                />
              </Form.Item>
              <Form.Item label="Time Range">
                <RangePicker
                  showTime={{ format: 'HH' }}
                  // minuteStep={30}
                  showMinute={false}
                  showHour={true}
                  hourStep={2}
                  format="YYYY-MM-DD HH"
                  value={formValue.timerange}
                  onChange={(value, dateString) => {
                    setFormValue((current) => ({
                      ...current,
                      timerange: value,
                    }));
                  }}
                />
              </Form.Item>
              <Form.Item label="interval" rules={[{ required: true }]}>
                <Select
                  value={formValue.interval}
                  placeholder="Select interval"
                  onChange={(value) =>
                    setFormValue((current) => ({
                      ...current,
                      interval: value,
                    }))
                  }
                >
                  <Option value="4h">4h</Option>
                  <Option value="8h">8h</Option>
                  <Option value="1d">1d</Option>
                  <Option value="3d">3d</Option>
                  <Option value="1w">1w</Option>
                  <Option value="1M">1M</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Find Patterns
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Row gutter={8} style={{ marginTop: '30px' }}>
          <Col sm={12}>
            <Chart data={ohlc} />
          </Col>
          <Col sm={7}>
            <Patterns data={ohlc} />
          </Col>
          <Col sm={5}>
            <JSONData data={ohlc} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
