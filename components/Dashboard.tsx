
import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Package, 
  HandCoins, 
  FileDown, 
  PieChart as PieChartIcon, 
  AlertCircle,
  Coins,
  ArrowUpRight,
  Calculator
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FinancialData } from '../types';

interface DashboardProps {
  data: FinancialData;
  onExport: (format: 'pdf' | 'excel') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onExport }) => {
  const netProfit = data.income - (data.expenses + data.wages);
  const zakatBase = (data.liquidity + data.inventory + data.debtsToUs) - data.debtsByUs;
  const goldThreshold = data.goldPrice * 85;
  const isZakatRequired = zakatBase >= goldThreshold;
  const zakatAmount = isZakatRequired ? zakatBase * 0.025 : 0;

  const chartData = [
    { name: 'صافي الربح', value: Math.max(0, netProfit), color: '#10b981' },
    { name: 'المصاريف العامة', value: data.expenses, color: '#f59e0b' },
    { name: 'أجور العمال', value: data.wages, color: '#ef4444' },
  ];

  // استخدام الدينار الجزائري DA
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1 font-['Cairo']">لوحة التحكم المالية</h1>
          <p className="text-slate-500 font-medium">ملخص الأداء السنوي وحسابات الزكاة الشرعية بالدينار الجزائري</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onExport('excel')} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <FileDown className="w-5 h-5" />
            تصدير Excel
          </button>
          <button onClick={() => onExport('pdf')} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100">
            <FileDown className="w-5 h-5" />
            تقرير PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-emerald-200 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">نمو سنوي</span>
          </div>
          <h3 className="text-slate-400 text-sm font-bold mb-1">صافي الربح المتوقع</h3>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(netProfit)}</p>
          <div className="mt-4 flex items-center gap-1 text-emerald-600 font-bold text-xs">
            <ArrowUpRight className="w-3 h-3" />
            <span>+١٢٪ عن العام الماضي</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-blue-200 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-bold mb-1">قيمة المخزون</h3>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(data.inventory)}</p>
          <p className="mt-4 text-slate-400 text-xs font-bold">محدث: {new Date(data.lastUpdated).toLocaleDateString('ar-DZ')}</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-purple-200 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-purple-50 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-bold mb-1">السيولة المتاحة</h3>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(data.liquidity)}</p>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-purple-500 w-[75%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-orange-200 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-orange-50 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
              <HandCoins className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-bold mb-1">صافي الديون</h3>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(data.debtsToUs - data.debtsByUs)}</p>
          <p className="mt-4 text-xs font-bold text-slate-400 flex items-center gap-2">
            <Calculator className="w-3 h-3" />
            بعد خصم المطالبات علينا
          </p>
        </div>
      </div>

      <div className={`p-10 rounded-[2.5rem] border-2 transition-all duration-700 relative overflow-hidden ${isZakatRequired ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
        {isZakatRequired && (
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        )}
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
            <div className={`p-6 rounded-3xl ${isZakatRequired ? 'bg-amber-100 text-amber-700 shadow-xl shadow-amber-200/50 animate-bounce' : 'bg-slate-200 text-slate-400'}`}>
              <Coins className="w-14 h-14" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h2 className="text-3xl font-black text-slate-900">حساب الزكاة</h2>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isZakatRequired ? 'bg-amber-600 text-white' : 'bg-slate-400 text-white'}`}>
                  {isZakatRequired ? 'واجبة' : 'غير واجبة'}
                </div>
              </div>
              <p className="text-slate-600 max-w-xl font-medium leading-relaxed">
                يتم حساب الزكاة بنسبة ٢.٥٪ من الوعاء الزكوي إذا بلغ النصاب (قيمة ٨٥ جرام ذهب عيار ٢٤). 
                الوعاء الزكوي الحالي هو <span className="font-bold text-slate-900">{formatCurrency(zakatBase)}</span>.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 min-w-[280px] text-center border border-white">
            <span className="text-sm text-slate-400 font-bold block mb-2">المبلغ المستحق للدفع</span>
            <span className={`text-4xl font-black block transition-all duration-700 ${isZakatRequired ? 'text-amber-600 scale-110' : 'text-slate-300'}`}>
              {isZakatRequired ? formatCurrency(zakatAmount) : 'لم يبلغ النصاب'}
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
          <div className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 flex items-center gap-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-bold text-slate-700">سعر الذهب: {formatCurrency(data.goldPrice)} / ج</span>
          </div>
          <div className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 flex items-center gap-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-sm font-bold text-slate-700">النصاب: {formatCurrency(goldThreshold)}</span>
          </div>
          <div className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 flex items-center gap-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-sm font-bold text-slate-700">الوعاء: {formatCurrency(zakatBase)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <PieChartIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">توزيع المصاريف والربح</h3>
            </div>
          </div>
          
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={10}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200 flex flex-col justify-between h-full group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <h4 className="text-slate-400 font-bold text-sm mb-2 uppercase tracking-widest">إجمالي الدخل السنوي</h4>
              <p className="text-5xl font-black mb-10 tracking-tighter">{formatCurrency(data.income)}</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-400">صافي الربح</span>
                    <span className="text-emerald-400">{Math.round((netProfit / data.income) * 100) || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-1500 delay-300" 
                      style={{ width: `${Math.max(0, Math.min(100, (netProfit / data.income) * 100))}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-400">التكاليف التشغيلية</span>
                    <span className="text-red-400">{Math.round(((data.expenses + data.wages) / data.income) * 100) || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div 
                      className="bg-red-500 h-full rounded-full transition-all duration-1500 delay-500" 
                      style={{ width: `${Math.max(0, Math.min(100, ((data.expenses + data.wages) / data.income) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-between relative z-10">
               <div>
                 <p className="text-xs text-slate-400 font-bold mb-1">الربح الصافي</p>
                 <p className="text-xl font-black text-emerald-400">{formatCurrency(netProfit)}</p>
               </div>
               <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ArrowUpRight className="w-6 h-6" />
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
             <AlertCircle className="w-6 h-6" />
           </div>
           <div>
             <h4 className="font-black text-slate-900">تنبيهات النظام الذكي</h4>
             <p className="text-slate-500 text-sm font-medium">يرجى التأكد من إدخال الديون التي "علينا" لخصمها من وعاء الزكاة.</p>
           </div>
         </div>
         <div className="text-sm font-bold text-slate-400">
           آخر فحص للنظام: {new Date().toLocaleTimeString('ar-DZ')}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
