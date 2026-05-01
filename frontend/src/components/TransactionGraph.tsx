import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Transaction = {
    date: string;
    amount: number;
    type: string;
};

function TransactionGraph({ data }: { data: Transaction[] }) {
    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1A2433', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#E2E8F0',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: '#2E7D64' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#2E7D64" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#2E7D64', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TransactionGraph;
