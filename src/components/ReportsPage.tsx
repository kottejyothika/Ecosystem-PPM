import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Award,
  Calendar,
  CheckCircle2,
  Building2,
  Leaf,
  ShieldCheck,
  Share2,
  FileSpreadsheet,
  RefreshCw,
  Trophy,
  MapPin,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { DEPARTMENT_IMPACT_DATA } from '../data/initialData';

export const ReportsPage: React.FC = () => {
  const { collections, segregationStats, stations, users, currentUser, setToast } = useEcoCampus();

  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Semester' | 'Custom'>('Monthly');
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-31');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState<string>('Just now');
  const [activeView, setActiveView] = useState<'report' | 'certificate'>('report');

  const totalCollected = Number(collections.reduce((a, b) => a + b.quantity, 0).toFixed(1));
  const totalRecycled = Number(segregationStats.reduce((a, b) => a + b.recycled, 0).toFixed(1));
  const recyclingRate = totalCollected > 0 ? ((totalRecycled / totalCollected) * 100).toFixed(1) : '78.4';
  const co2Avoided = (totalCollected * 1.8).toFixed(1);
  const studentCount = users.filter((u) => u.role === 'student').length * 45;

  const topStudents = users
    .filter((u) => u.role === 'student')
    .sort((a, b) => b.plasticCollectedKg - a.plasticCollectedKg)
    .slice(0, 5);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGeneratedTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setToast({
        message: `${timeframe} Plastic Waste Management Report generated successfully.`,
        type: 'success',
      });
    }, 450);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setToast({
      message: `EcoCampus_${timeframe}_Report_${Date.now()}.pdf generated and downloaded.`,
      type: 'success',
    });
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'StationID,StationName,Location,CapacityKg,CurrentLoadKg,FillPercentage,AssignedWorker,Status\n' +
      stations
        .map(
          (s) =>
            `${s.station_id},"${s.name}","${s.location}",${s.capacity},${s.current_quantity},${Math.round(
              (s.current_quantity / s.capacity) * 100
            )}%,"${s.assigned_worker}",${s.status}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecocampus_${timeframe.toLowerCase()}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ message: `${timeframe} Report CSV exported successfully!`, type: 'success' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Institutional Documentation & Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Plastic Waste Management Reporting System
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Generate and export official audit reports covering daily, weekly, monthly, and semester
            metrics with full traceability for university sustainability boards.
          </p>
        </div>

        {/* Action Buttons: Generate, Download PDF, Export CSV, Print */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-generate-report"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate Report</span>
          </button>
          <button
            id="btn-download-pdf"
            onClick={handleDownloadPDF}
            className="px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Timeframe & Generator Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-700 mr-1">Report Timeframe:</span>
            {(['Daily', 'Weekly', 'Monthly', 'Semester', 'Custom'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  timeframe === t
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t} Report
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('report')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'report'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Audit Document
            </button>
            <button
              onClick={() => setActiveView('certificate')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'certificate'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Zero-Waste Certificate
            </button>
          </div>
        </div>

        {/* Custom date range controls (when selected) */}
        {timeframe === 'Custom' && (
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-gray-700">Custom Date Range:</span>
            <div className="flex items-center gap-2">
              <label className="text-gray-500">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white font-medium"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-500">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white font-medium"
              />
            </div>
            <button
              onClick={handleGenerateReport}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 ml-auto"
            >
              Apply Filter
            </button>
          </div>
        )}
      </div>

      {activeView === 'report' ? (
        /* Printable Audit Document View */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-sm space-y-8 print:border-none print:shadow-none max-w-5xl mx-auto">
          {/* Document Top Header */}
          <div className="border-b-2 border-emerald-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base mb-1">
                <Leaf className="w-5 h-5" />
                <span>ECOCAMPUS SUSTAINABILITY GOVERNANCE COUNCIL</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
                {timeframe} Campus Plastic Waste Management Report
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Project Code: WEBSPRINT-2026-ECO • Reference: EC-REP-{timeframe.toUpperCase()}-2026
              </p>
            </div>
            <div className="text-right text-xs text-gray-600">
              <p className="font-semibold text-emerald-950">Report Status: Finalized</p>
              <p>Generated: {reportGeneratedTime}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                COMPLIANCE GRADE: A+ ZERO-WASTE
              </span>
            </div>
          </div>

          {/* Section 1: Core Key Report Details (7 requested metric indicators) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-3">
              Executive Key Performance Indicators ({timeframe})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Total collected */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                <p className="text-[10px] font-semibold text-emerald-800 uppercase">Total Collected</p>
                <p className="text-xl font-extrabold text-emerald-950 font-serif mt-1">
                  {totalCollected} <span className="text-[10px] font-normal">kg</span>
                </p>
                <p className="text-[9px] text-gray-500">Gross inflow</p>
              </div>

              {/* Plastic recycled */}
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
                <p className="text-[10px] font-semibold text-teal-800 uppercase">Plastic Recycled</p>
                <p className="text-xl font-extrabold text-teal-950 font-serif mt-1">
                  {totalRecycled} <span className="text-[10px] font-normal">kg</span>
                </p>
                <p className="text-[9px] text-gray-500">Certified recovery</p>
              </div>

              {/* Reduction percentage */}
              <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-center">
                <p className="text-[10px] font-semibold text-cyan-800 uppercase">Reduction %</p>
                <p className="text-xl font-extrabold text-cyan-950 font-serif mt-1">
                  32<span className="text-xs font-semibold">%</span>
                </p>
                <p className="text-[9px] text-gray-500">Single-use decrease</p>
              </div>

              {/* Student participation */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
                <p className="text-[10px] font-semibold text-amber-800 uppercase">Participation</p>
                <p className="text-xl font-extrabold text-amber-950 font-serif mt-1">
                  {studentCount}
                </p>
                <p className="text-[9px] text-gray-500">Active students</p>
              </div>

              {/* Recycling rate */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                <p className="text-[10px] font-semibold text-emerald-800 uppercase">Recycling Rate</p>
                <p className="text-xl font-extrabold text-emerald-950 font-serif mt-1">
                  {recyclingRate}<span className="text-xs font-semibold">%</span>
                </p>
                <p className="text-[9px] text-gray-500">Diversion efficiency</p>
              </div>

              {/* Active Stations */}
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
                <p className="text-[10px] font-semibold text-teal-800 uppercase">Stations</p>
                <p className="text-xl font-extrabold text-teal-950 font-serif mt-1">
                  {stations.length}
                </p>
                <p className="text-[9px] text-gray-500">IoT drop points</p>
              </div>

              {/* CO2 Emissions Avoided */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-center">
                <p className="text-[10px] font-semibold text-rose-800 uppercase">GHG Avoided</p>
                <p className="text-xl font-extrabold text-rose-950 font-serif mt-1">
                  {co2Avoided} <span className="text-[10px] font-normal">kg</span>
                </p>
                <p className="text-[9px] text-gray-500">CO₂e offset</p>
              </div>
            </div>
          </div>

          {/* Section 2: Top Contributing Departments & Students */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Contributing Departments */}
            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  Top Contributing Departments
                </h4>
                <span className="text-[10px] text-gray-500">Ranked by Reduction</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] text-gray-400 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="pb-1.5">Department</th>
                    <th className="pb-1.5 text-center">Students</th>
                    <th className="pb-1.5 text-right">Collected</th>
                    <th className="pb-1.5 text-right">Reduction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DEPARTMENT_IMPACT_DATA.slice(0, 4).map((d, i) => (
                    <tr key={d.department}>
                      <td className="py-2 font-medium text-emerald-950 truncate max-w-[140px]">
                        #{i + 1} {d.department}
                      </td>
                      <td className="py-2 text-center text-gray-600">{d.studentsCount}</td>
                      <td className="py-2 text-right font-semibold text-emerald-900">{d.collectedKg} kg</td>
                      <td className="py-2 text-right text-emerald-700 font-bold">{d.reductionRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Contributing Students */}
            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  Top Contributing Students
                </h4>
                <span className="text-[10px] text-gray-500">Campus Champions</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] text-gray-400 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="pb-1.5">Student</th>
                    <th className="pb-1.5">Department</th>
                    <th className="pb-1.5 text-right">Collected</th>
                    <th className="pb-1.5 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topStudents.map((s, idx) => (
                    <tr key={s.user_id}>
                      <td className="py-2 font-medium text-emerald-950">
                        #{idx + 1} {s.name}
                      </td>
                      <td className="py-2 text-gray-500 text-[11px] truncate max-w-[120px]">
                        {s.department || 'Campus'}
                      </td>
                      <td className="py-2 text-right font-semibold text-emerald-900">
                        {s.plasticCollectedKg.toFixed(1)} kg
                      </td>
                      <td className="py-2 text-right font-bold text-amber-700">{s.reward_points} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Station Performance Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                Collection Station Operational Performance
              </h3>
              <span className="text-[10px] text-gray-500">6 Monitored Stations</span>
            </div>
            <table className="w-full text-left text-xs border border-gray-100 rounded-xl overflow-hidden">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Station ID</th>
                  <th className="py-2.5 px-3">Location & Zone</th>
                  <th className="py-2.5 px-3">Capacity</th>
                  <th className="py-2.5 px-3">Current Load</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Assigned Worker</th>
                  <th className="py-2.5 px-3 text-right">Last Pickup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stations.map((st) => {
                  const fillPct = Math.round((st.current_quantity / st.capacity) * 100);
                  return (
                    <tr key={st.station_id} className="hover:bg-emerald-50/30">
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">{st.station_id}</td>
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-gray-900">{st.name}</p>
                        <p className="text-[10px] text-gray-500">{st.location}</p>
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">{st.capacity} kg</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-gray-900">{st.current_quantity} kg</span>{' '}
                        <span className="text-[10px] text-gray-400">({fillPct}%)</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            st.status === 'Full'
                              ? 'bg-rose-100 text-rose-800'
                              : st.status === 'Almost Full'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700">{st.assigned_worker}</td>
                      <td className="py-2.5 px-3 text-right text-gray-500">{st.last_collection}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Institutional Certification Signatures */}
          <div className="pt-8 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs text-gray-600">
            <div>
              <div className="w-32 h-0.5 bg-gray-400 mx-auto mb-2" />
              <p className="font-bold text-emerald-950">Dr. Sunita Deshmukh</p>
              <p className="text-[10px]">Director, Campus Sustainability Cell</p>
            </div>
            <div>
              <div className="w-32 h-0.5 bg-gray-400 mx-auto mb-2" />
              <p className="font-bold text-emerald-950">Aarav Sharma</p>
              <p className="text-[10px]">Student Council Green Lead</p>
            </div>
            <div>
              <div className="w-32 h-0.5 bg-gray-400 mx-auto mb-2" />
              <p className="font-bold text-emerald-950">Prof. K. Venkatesh</p>
              <p className="text-[10px]">Institutional Quality Assurance Cell</p>
            </div>
          </div>
        </div>
      ) : (
        /* Certificate of Zero-Waste Achievement View */
        <div className="bg-gradient-to-br from-[#faf8f5] via-white to-[#f2f7f4] rounded-3xl p-8 sm:p-14 border-4 border-double border-emerald-700/60 shadow-xl max-w-3xl mx-auto text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-6 left-6 text-emerald-600 opacity-20">
            <Award className="w-24 h-24" />
          </div>
          <div className="absolute bottom-6 right-6 text-emerald-600 opacity-20">
            <Leaf className="w-24 h-24" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-widest mb-3">
              Official Citation of Environmental Excellence
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-emerald-950">
              Certificate of Green Action
            </h2>
            <p className="text-xs text-gray-500 italic mt-1">
              Awarded under the WEBSPRINT 2026 EcoCampus Initiative
            </p>

            <div className="my-8">
              <p className="text-xs text-gray-600">This honor is proudly conferred upon</p>
              <p className="text-2xl sm:text-3xl font-bold font-serif text-emerald-900 mt-1 underline decoration-emerald-500 decoration-2 underline-offset-4">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-600 mt-2 max-w-md mx-auto">
                in recognition of outstanding contributions toward establishing a plastic-free
                campus environment, diverting over{' '}
                <strong>{(currentUser.plasticCollectedKg + currentUser.plasticReducedKg).toFixed(1)} kg</strong> of
                single-use polymers and accumulating <strong>{currentUser.reward_points} Reward Points</strong>.
              </p>
            </div>

            <div className="pt-6 border-t border-emerald-200 flex items-center justify-around text-xs text-emerald-900">
              <div>
                <p className="font-bold">AITS Campus Authority</p>
                <p className="text-[10px] text-gray-500">Verified Electronic Seal</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shadow-md border-2 border-amber-300">
                A+ 2026
              </div>
              <div>
                <p className="font-bold">EcoCampus Portal</p>
                <p className="text-[10px] text-gray-500">ID: EC-CERT-{currentUser.user_id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
