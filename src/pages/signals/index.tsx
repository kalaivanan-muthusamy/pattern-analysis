import { useEffect, useState } from "react";
import { Card, Col, Form, Row, DatePicker, Select, Button, Result } from "antd";
import Title from "antd/es/typography/Title";
import dayjs, { Dayjs } from "dayjs";
import { ASSETS } from "./assets";
import axios from "axios";
import { processCandles } from "../../modules/candle";
import { getCandlestickPatterns } from "../../modules/patterns";
import { CandleImpact, FuturePotential } from "../../modules/candle/constants";
import { ArrowDownOutlined, ArrowUpOutlined, SwapOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const Option = Select;

const LSKey = 'signalPreferences';

interface IFormValues {
    timeframe: string
    timerange: [Dayjs, Dayjs] | null
    impactFilter: CandleImpact[],
}

function getDefaultFormValues() {
    const savedFormValues = localStorage.getItem(LSKey);
    let formValues: IFormValues = {
        timeframe: '8h',
        timerange: null,
        impactFilter: [CandleImpact.Critical],
        ...(savedFormValues ? JSON.parse(savedFormValues) : {})
    }
    if (Array.isArray(formValues.timerange) && formValues.timerange.length > 0) {
        const startTime = dayjs(formValues.timerange[0]);
        const endTime = dayjs(formValues.timerange[0]);
        formValues.timerange = [startTime, endTime];
    }
    return formValues;
}

export function Signals() {
    const [formValue, setFormValue] = useState(getDefaultFormValues());
    const [, setKlines] = useState({});
    const [patterns, setPatterns] = useState([]);

    useEffect(() => {
        localStorage.setItem(LSKey, JSON.stringify(formValue));
    }, [formValue])

    async function onFinish() {
        const startTime = formValue.timerange?.[0]?.valueOf();
        const endTime = formValue.timerange?.[1]?.valueOf();
        // Get Klines
        const klinePromises = ASSETS.map(async (asset) => {
            const kline = await axios.get('https://api.binance.com/api/v3/klines', {
                params: {
                    symbol: asset,
                    interval: formValue.timeframe,
                    startTime,
                    endTime,
                    limit: 100,
                },
            });
            return { [asset]: kline.data };
        })
        const allKlines = await Promise.all(klinePromises);
        setKlines(allKlines);
        getPattersn(allKlines);
    }

    function getPattersn(allKlines: any) {
        const allPatterns: any = [];
        allKlines.map((klineObj: any) => {
            const asset = Object.keys(klineObj)[0] as string;
            const kline = Object.values(klineObj)[0] as (string | number)[][];
            const candles = processCandles(kline);
            const activeCandle = candles[candles.length - 2];
            const pastCandles = candles.slice(0, -2);
            const patterns = getCandlestickPatterns(activeCandle, pastCandles);
            allPatterns.push({ [asset]: patterns })
        })

        const formattedPatterns: any = {};
        allPatterns.map((pattern: any) => {
            const asset = Object.keys(pattern)[0];
            const patterns = Object.values(pattern)[0] as Array<any>;
            patterns?.map?.(pattern => {
                const key = `${pattern.name} (${pattern.result.impact})`;
                if (formattedPatterns[key]) {
                    formattedPatterns[key].matchedAssets.push(asset);
                    formattedPatterns[key].matchedAssets = formattedPatterns[key].matchedAssets.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
                } else {
                    formattedPatterns[key] = {
                        pattern: pattern.name,
                        patternType: pattern.futurePotential,
                        impact: pattern.result.impact,
                        matchedAssets: [asset]
                    }
                }
            })
        })
        setPatterns(Object.values(formattedPatterns));
    }

    function displayPatterns() {
        console.log(patterns);
        const bullishPatterns = patterns.filter(pattern => pattern.patternType === FuturePotential.Bullish);
        const neutralPatterns = patterns.filter(pattern => pattern.patternType === FuturePotential.Neutral);
        const bearishPatterns = patterns.filter(pattern => pattern.patternType === FuturePotential.Bearish);
        return (
            <>
                {patterns?.length > 0 ? <Row gutter={96}>
                    <Col sm={8}>
                        <h3 style={{ color: '#389e0d' }}>Bullish Patterns <ArrowUpOutlined /></h3>
                        {patternByImpact(bullishPatterns)}
                    </Col>
                    <Col sm={8}>
                        <h3>Neutral Patterns <SwapOutlined /></h3>
                        {patternByImpact(neutralPatterns)}
                    </Col>
                    <Col sm={8}>
                        <h3 style={{ color: '#cf1322' }}>Bearish Patterns <ArrowDownOutlined /></h3>
                        {patternByImpact(bearishPatterns)}
                    </Col>
                </Row> : <Row>
                    <Col sm={24}>
                        <Result
                            title="No matched patterns"
                        />
                    </Col>
                </Row>}
            </>
        )
    }

    function patternByImpact(patterns: any) {
        const criticalPatterns = patterns.filter(p => p.impact === CandleImpact.Critical);
        const highPatterns = patterns.filter(p => p.impact === CandleImpact.High);
        const mediumPatterns = patterns.filter(p => p.impact === CandleImpact.Medium);
        const lowPatterns = patterns.filter(p => p.impact === CandleImpact.Low);

        return (
            <>
                {formValue.impactFilter?.includes(CandleImpact.Critical) && criticalPatterns.length > 0 && criticalPatterns.map(pattern => (
                    <div style={{ marginTop: '15px' }}>
                        <h4 style={{ textDecoration: 'underline' }}>{pattern.pattern} (Critical)</h4>
                        <p>{pattern.matchedAssets.join(", ")}</p>
                    </div>

                ))}
                {formValue.impactFilter?.includes(CandleImpact.High) && highPatterns.length > 0 && highPatterns.map(pattern => (
                    <div style={{ marginTop: '15px' }}>
                        <h4>{pattern.pattern} (High)</h4>
                        <p>{pattern.matchedAssets.join(", ")}</p>
                    </div>

                ))}
                {formValue.impactFilter?.includes(CandleImpact.Medium) && mediumPatterns.length > 0 && mediumPatterns.map(pattern => (
                    <div style={{ marginTop: '15px' }}>
                        <h4>{pattern.pattern} (Medium)</h4>
                        <p>{pattern.matchedAssets.join(", ")}</p>
                    </div>

                ))}
                {formValue.impactFilter?.includes(CandleImpact.Low) && lowPatterns.length > 0 && lowPatterns.map(pattern => (
                    <div style={{ marginTop: '15px' }}>
                        <h4>{pattern.pattern} (Low)</h4>
                        <p>{pattern.matchedAssets.join(", ")}</p>
                    </div>

                ))}
            </>
        )
    }


    return (
        <>
            <Title level={4}>Signals</Title>
            <Row>
                <Col sm={24}>
                    <Card>
                        <Form layout="inline" onFinish={onFinish}>
                            <Form.Item label="timeframe" rules={[{ required: true }]}>
                                <Select
                                    style={{ minWidth: '200px' }}
                                    value={formValue.timeframe}
                                    placeholder="Select timeframe"
                                    onChange={(value) =>
                                        setFormValue((current) => ({
                                            ...current,
                                            timeframe: value,
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
                            <Form.Item label="Time Range">
                                <RangePicker
                                    // showTime={{ format: 'HH' }}
                                    // minuteStep={30}
                                    showMinute={false}
                                    format="YYYY-MM-DD"
                                    value={formValue.timerange}
                                    onChange={(value) => {
                                        setFormValue((current) => ({
                                            ...current,
                                            timerange: value,
                                        }));
                                    }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" type="primary">
                                    Get Signals
                                </Button>
                            </Form.Item>
                        </Form>
                        <Form style={{ marginTop: '20px' }} layout="inline" >
                            <Form.Item label="Impact Filter">
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ minWidth: '200px', width: '100%' }}
                                    placeholder="Please select"
                                    value={formValue.impactFilter}
                                    onChange={(value) =>
                                        setFormValue((current) => ({
                                            ...current,
                                            impactFilter: value,
                                        }))
                                    }
                                    options={[
                                        {
                                            label: 'Critical',
                                            value: 'Critical',
                                        },
                                        {
                                            label: 'High',
                                            value: 'High',
                                        },
                                        {
                                            label: 'Medium',
                                            value: 'Medium',
                                        },
                                        {
                                            label: 'Low',
                                            value: 'Low',
                                        }
                                    ]}
                                />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <Row gutter={8} style={{ marginTop: '30px' }}>
                <Col sm={24}>
                    <Card title="Patterns">
                        {displayPatterns()}
                    </Card></Col>
            </Row>
        </>
    )
}