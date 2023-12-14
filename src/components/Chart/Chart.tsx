'use client';

import { formatCurrency } from '@/utils/currency/currency';
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
type Data = {
  name: string;
  total: number;
};
type Props = {
  data: Data[];
};
export function Chart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350} className="pt-4">
      <BarChart
        data={data}
        margin={{
          top: 20
        }}
      >
        <XAxis
          dataKey="name"
          stroke="#2c2c2c"
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          allowDataOverflow={true}
          tickLine={true}
          dx={-5}
          axisLine={true}
          tickFormatter={(value) => `${formatCurrency(value)}`}
        />
        <Bar dataKey="total" fill="rgba(33, 33, 33, 0.5)" radius={[4, 4, 0, 0]}>
          <LabelList dataKey="name" content={<p>Hello</p>} />
        </Bar>
        <Tooltip
          formatter={(value) =>
            Number(value) <= 0 ? '0 kr' : formatCurrency(Number(value))
          }
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
