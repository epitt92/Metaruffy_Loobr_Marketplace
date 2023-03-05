import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
    stats: any
}
export default class BaarChart extends PureComponent<Props> {

    render() {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={this.props.stats}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}>
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis dataKey="monthName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="vloumeTraded" name='Vloume Traded' stroke="#F1C94A" activeDot={{ r: 12 }} />
                    <Line type="monotone" dataKey="user" name={'Users'} stroke="#82ca9d" activeDot={{ r: 12 }} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
