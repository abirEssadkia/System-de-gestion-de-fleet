
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface OverspeedData {
  range: string;
  vehicle_count: number;
  percentage: number;
}

interface OverspeedChartsProps {
  data: OverspeedData[];
}

const OverspeedCharts: React.FC<OverspeedChartsProps> = ({ data }) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];

  const totalVehicles = data.reduce((sum, item) => sum + item.vehicle_count, 0);
  const totalPercentage = data.reduce((sum, item) => sum + item.percentage, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground">en dépassement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalPercentage)}%</div>
            <p className="text-xs text-muted-foreground">de dépassement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tranche la Plus Fréquente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.reduce((prev, current) => 
                prev.vehicle_count > current.vehicle_count ? prev : current, data[0]
              )?.range.split(' ')[0] || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">km/h au-dessus</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Nombre de Véhicules par Tranche de Dépassement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, 'Véhicules']}
                  labelFormatter={(label) => `Tranche: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="vehicle_count" 
                  fill="#8884d8" 
                  name="Nombre de véhicules"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Dépassements (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.filter(item => item.vehicle_count > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percentage }) => `${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="vehicle_count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${props.payload.vehicle_count} véhicules (${props.payload.percentage.toFixed(1)}%)`,
                    props.payload.range
                  ]}
                />
                <Legend 
                  formatter={(value, entry) => entry.payload.range}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart for Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tendance des Dépassements par Tranche</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="vehicle_count" 
                fill="#8884d8" 
                name="Nombre de véhicules"
                opacity={0.7}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="percentage" 
                stroke="#ff7300" 
                name="Pourcentage"
                strokeWidth={3}
                dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des Tranches de Dépassement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Tranche de Dépassement</th>
                  <th className="text-left p-2 font-medium">Nombre de Véhicules</th>
                  <th className="text-left p-2 font-medium">Pourcentage</th>
                  <th className="text-left p-2 font-medium">Niveau de Risque</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{item.range}</td>
                    <td className="p-2 font-mono">{item.vehicle_count}</td>
                    <td className="p-2 font-mono">{item.percentage.toFixed(2)}%</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        index <= 1 ? 'bg-green-100 text-green-800' :
                        index <= 2 ? 'bg-yellow-100 text-yellow-800' :
                        index <= 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {index <= 1 ? 'Faible' :
                         index <= 2 ? 'Modéré' :
                         index <= 3 ? 'Élevé' : 'Critique'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverspeedCharts;
