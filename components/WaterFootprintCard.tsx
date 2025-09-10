import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WaterFootprintData } from '../types';

interface WaterFootprintCardProps {
  data: WaterFootprintData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const WaterFootprintCard: React.FC<WaterFootprintCardProps> = ({ data }) => {
  const chartData = data.breakdown.map(item => ({ name: item.stage, value: item.liters }));
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-dark-blue mb-2">
        {data.itemName}
      </h2>
      <div className="text-center mb-6">
        <p className="text-5xl md:text-6xl font-bold text-accent-blue">
          {data.waterFootprintLiters.toLocaleString()}
        </p>
        <p className="text-lg text-slate-600">liters of water</p>
      </div>
      
      <div className="text-center bg-light-blue p-4 rounded-lg mb-8">
        <p className="text-md md:text-lg text-dark-blue">
          That's roughly equivalent to <span className="font-semibold">{data.comparison}</span>.
        </p>
      </div>

      <h3 className="text-xl font-semibold text-dark-blue mb-4 text-center">Water Usage Breakdown</h3>
      <div className="w-full h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                 const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                 const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                 const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                 return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                        {`${(percent * 100).toFixed(0)}%`}
                    </text>
                 );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} liters`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterFootprintCard;