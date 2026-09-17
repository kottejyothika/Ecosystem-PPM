import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Download,
  Calendar,
  Layers,
  Leaf,
  Users,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useEcoCampus } from '../context/EcoCampusContext';
import {
  INITIAL_MONTHLY_METRICS,
  WEEKLY_ANALYTICS_DATA,
  DEPARTMENT_IMPACT_DATA,
} from '../data/initialData';

export const AnalyticsPage: React.FC = () => {
  const { collections, segregationStats, stations, setToast } = useEcoCampus();
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'categories' | 'departments'>('overview');

  const totalCollected = Number(collections.reduce((a, b) => a + b.quantity, 0).toFixed(1));
  const totalRecycled = Number(segregationStats.reduce((a, b) => a + b.recycled, 0).toFixed(1));
  const diversionRate = totalCollected > 0 ? Math.round((totalRecycled / totalCollected) * 100) : 78;

  // Dynamically update latest month with live collections
  const liveMonthlyData = INITIAL_MONTHLY_METRICS.map((m, index) => {
    if (index === INITIAL_MONTHLY_METRICS.length - 1) {
      return {
        ...m,
        collected: Number((1250 + (totalCollected - 14.8)).toFixed(1)),
        recycled: Number((980 + (totalRecycled - 10)).toFixed(1)),
      };
    }
    return m;
  });

  // Collection vs Recycling by category dataset
  const categoryComparisonData = segregationStats.map((item) => ({
    name: item.category.replace('Plastic ', ''),
    Collected: item.collected,
    Recycled: item.recycled,
    Pending: item.pending,
  }));

  // Pie chart data
  const pieData = segregationStats.map((s) => ({
    name: s.category,
    value: s.collected,
    color: s.color,
  }));

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Date,Station,PlasticType,QuantityKg,PointsAwarded\n' +
      collections
        .map(
          (c) =>
            `${c.date},${c.stationName},${c.plastic_type},${c.quantity},${c.pointsAwarded}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecocampus_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ message: 'Analytics CSV exported successfully!', type: 'success' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Environmental Telemetry & Circular Flow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Campus Plastic Analytics
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Real-time interactive charts monitoring campus waste inflow, plastic segregation ratios,
            circular recycling rate, and student participation over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-emerald-950 font-bold shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Charts
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                activeTab === 'trends'
                  ? 'bg-white text-emerald-950 font-bold shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trends
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                activeTab === 'categories'
                  ? 'bg-white text-emerald-950 font-bold shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Streams
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                activeTab === 'departments'
                  ? 'bg-white text-emerald-950 font-bold shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Departments
            </button>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Total Volume Collected</span>
          <p className="text-3xl font-bold font-serif text-emerald-950 mt-1">
            {totalCollected} <span className="text-xs font-normal">kg</span>
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">↑ 18.2% month-over-month</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Recycling Conversion Rate</span>
          <p className="text-3xl font-bold font-serif text-teal-950 mt-1">{diversionRate}%</p>
          <span className="text-[11px] text-teal-700 font-medium">Certified mechanical recovery</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">CO₂e Emissions Prevented</span>
          <p className="text-3xl font-bold font-serif text-emerald-950 mt-1">
            {(totalCollected * 1.8).toFixed(1)} <span className="text-xs font-normal">kg</span>
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Calculated EPA WARM factor</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Campus Plastic Reduction</span>
          <p className="text-3xl font-bold font-serif text-amber-950 mt-1">
            32<span className="text-sm font-semibold">%</span>
          </p>
          <span className="text-[11px] text-amber-700 font-medium">Single-use baseline reduction</span>
        </div>
      </div>

      {/* Chart 1: Monthly Plastic Collection (Line Chart) */}
      {(activeTab === 'overview' || activeTab === 'trends') && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-serif text-emerald-950 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Monthly Plastic Collection Trend (Line Chart)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Total kilograms collected across university quarters from Oct 2025 to Mar 2026.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Live Aggregated
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liveMonthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} unit="kg" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#064e3b',
                    color: '#ecfdf5',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                  itemStyle={{ color: '#a7f3d0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="collected"
                  name="Plastic Collected (kg)"
                  stroke="#047857"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#047857', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="recycled"
                  name="Plastic Recycled (kg)"
                  stroke="#0d9488"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  dot={{ r: 5, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Grid: Plastic Category Share (Donut / Pie) & Collection vs Recycling (Bar Chart) */}
      {(activeTab === 'overview' || activeTab === 'categories') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 2: Plastic Category Distribution (Donut / Pie Chart) (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-emerald-950 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-emerald-600" />
                  Category Distribution (Donut Chart)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Segregated share by plastic resin type</p>
              </div>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} kg`, 'Collected']}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px' }}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-1 border-t border-gray-100">
              {segregationStats.map((item) => {
                const pct = Math.round((item.collected / totalCollected) * 100) || 25;
                return (
                  <div key={item.category} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-gray-800">{item.category}</span>
                    </span>
                    <span className="font-bold text-gray-900">
                      {item.collected} kg ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 3: Collection vs Recycling (Bar Chart) (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-emerald-950 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Collection vs. Recycling by Category (Bar Chart)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Comparison between gross waste received and verified recycled output.
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryComparisonData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} unit="kg" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="Collected" fill="#059669" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Recycled" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Pending" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                94.2% mechanical recycling yield achieved across PET and container streams.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Student Participation & Plastic Reduction (% over time) */}
      {(activeTab === 'overview' || activeTab === 'trends') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 4: Student Participation (Monthly Area Chart) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-emerald-950 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Student Participation Growth (Monthly Chart)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Monthly enrolled active student eco-volunteers and contributors.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                642 Active
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveMonthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="studentCount"
                    name="Active Students"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#studentGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: Plastic Reduction Percentage Over Time */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-emerald-950 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Plastic Reduction Rate (% Over Time)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Percentage reduction in single-use plastic waste generation on campus.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                Current: 32%
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liveMonthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} unit="%" domain={[0, 40]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Reduction Rate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="reductionRate"
                    name="Reduction Rate (%)"
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Department Comparison Table */}
      {(activeTab === 'overview' || activeTab === 'departments') && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-serif text-emerald-950 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Inter-Departmental Waste Reduction Performance
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Ranked by reduction achievement and total volume collected
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Enrolled Students</th>
                  <th className="py-2.5 px-3">Plastic Collected</th>
                  <th className="py-2.5 px-3">Reduction Achieved</th>
                  <th className="py-2.5 px-3">Campus Ranking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DEPARTMENT_IMPACT_DATA.map((dept, idx) => (
                  <tr key={dept.department} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-emerald-950">{dept.department}</td>
                    <td className="py-3 px-3 text-gray-600">{dept.studentsCount}</td>
                    <td className="py-3 px-3 font-bold text-emerald-900">{dept.collectedKg} kg</td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {dept.reductionRate}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          idx === 0
                            ? 'bg-amber-400 text-amber-950'
                            : idx === 1
                            ? 'bg-gray-200 text-gray-800'
                            : idx === 2
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-500'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
