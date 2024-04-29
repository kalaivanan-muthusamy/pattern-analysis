import React, { useEffect, useState } from 'react';
import {
  Input,
  Row,
  Col,
  Form,
  DatePicker,
  Select,
  Button,
  Layout,
  Card,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import Chart from './components/Chart';
import Patterns from './components/Patterns';
import { ICandle, processCandles } from './modules/candle';
import ProcessedCandles from './components/CandleData';
import { PatternResult, getCandlestickPatterns } from './modules/patterns';

const { RangePicker } = DatePicker;

function App() {
  const [formValue, setFormValue] = useState({
    interval: '8h',
    symbol: 'BTCUSDT',
    timerange: null,
    candleLength: '',
    showOnlyLastCandleResult: true,
  });
  const [ohlc, setOHLC] = useState<null | Array<string | number>[]>(null);
  const [activeOHLC, setActiveOHLC] = useState<null | Array<string | number>[]>(null);
  const [candles, setCandles] = useState<null | ICandle[]>(null);
  const [patterns, setPatterns] = useState<Array<PatternResult | null> | null>(null)

  function onFormInputChange(type, e) {
    setFormValue((current) => ({ ...current, [type]: e.target.value }));
  }

  function onFormCheckboxChange(type, e) {
    setFormValue((current) => ({ ...current, [type]: e.target.checked }));
  }

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
    let candleData: Array<string | number>[] = res.data || [];
    const candleLength = formValue.candleLength;
    if (candleLength) {
      const [start, end] = candleLength.split(",");
      const startIndex = parseInt(start);
      const endIndex = parseInt(end);
      if (!isNaN(startIndex) && !isNaN(endIndex)) {
        candleData = candleData.slice(startIndex, endIndex);
      }
    }
    setOHLC(res.data || []);
    setActiveOHLC(candleData);
    getCandlePatterns(candleData);
  }

  useEffect(() => {
    let candleData: Array<string | number>[] = ohlc || [];
    const candleLength = formValue.candleLength;
    if (candleLength) {
      const [start, end] = candleLength.split(",");
      const startIndex = parseInt(start);
      const endIndex = parseInt(end);
      if (!isNaN(startIndex) && !isNaN(endIndex)) {
        candleData = candleData.slice(startIndex, endIndex);
        setActiveOHLC(candleData);
        getCandlePatterns(candleData);
      }
    }
  }, [formValue.candleLength])

  function getCandlePatterns(data: Array<string | number>[]) {
    const candles = processCandles(data);
    let patterns: any = [];
    candles.map((candle, index) => {
      const result = getCandlestickPatterns(candle, candles.slice(0, index));
      patterns.push(result);
    })
    setPatterns(patterns);
    setCandles(candles);
  }

  return (
    <Layout>
      <Content style={{ padding: '24px 24px' }}>
        <Title>Pattern Analysis</Title>
        <Row>
          <Col sm={24}>
            <Card>
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
                    Analyse
                  </Button>
                </Form.Item>
              </Form>
              <Form style={{ marginTop: '20px' }} layout="inline" >
                <Form.Item label="Candle Length">
                  <Input
                    size='small'
                    placeholder="0,-1"
                    value={formValue.candleLength}
                    onChange={(e) => onFormInputChange('candleLength', e)}
                  />
                </Form.Item>
                <Form.Item label="Show last candle result only ">
                  <Input
                    type="checkbox"
                    checked={formValue.showOnlyLastCandleResult}
                    onChange={(e) => onFormCheckboxChange('showOnlyLastCandleResult', e)}

                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        <Row gutter={8} style={{ marginTop: '30px' }}>
          <Col sm={12}>
            <Chart data={activeOHLC} />
          </Col>
          <Col sm={5}>
            <Patterns data={patterns} />
          </Col>
          <Col sm={7}>
            <ProcessedCandles data={formValue.showOnlyLastCandleResult ? candles?.slice(-1) : candles} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
