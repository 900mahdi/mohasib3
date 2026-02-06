
import React, { useState, useEffect } from 'react';
import { Save, UserCheck, ShieldAlert, Banknote, Landmark, Box, Users, HandCoins, AlertCircle, Plus } from 'lucide-react';
import { FinancialData, UserRole } from '../types';
import VoiceInput from './VoiceInput';

interface DataEntryProps {
  data: FinancialData;
  userRole: UserRole;
  onChange: (newData: Partial<FinancialData>) => void;
  onSave: () => void;
}

const DataEntry: React.FC<DataEntryProps> = ({ data, userRole, onChange, onSave }) => {
  const isReadOnly = userRole === UserRole.ACCOUNTANT;

  // دالة لتنسيق الرقم مع فواصل الآلاف
  const formatNumber = (num: number | string) => {
    if (num === '' || num === undefined || num === null) return '';
    const stringValue = typeof num === 'string' ? num.replace(/,/g, '') : num.toString();
    if (isNaN(Number(stringValue))) return '';
    return Number(stringValue).toLocaleString('en-US');
  };

  // دالة لاستخراج الرقم الصافي من النص
  const parseNumber = (text: string) => {
    return text.replace(/[^0-9.]/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseNumber(e.target.value);
    const numValue = parseFloat(rawValue) || 0;
    onChange({ [e.target.name]: numValue });
  };

  const handleShortcut = (name: string, type: 'k' | 'm') => {
    const currentValue = (data as any)[name] || 0;
    let newValue = currentValue;
    if (type === 'k') newValue = currentValue * 1000 || 1000;
    if (type === 'm') newValue = currentValue * 1000000 || 1000000;
    onChange({ [name]: newValue });
  };

  const InputField = ({ label, name, value, icon: Icon, color }: any) => (
    <div className="space-y-2 group">
      <label className="text-sm font-bold text-slate-600 flex items-center gap-2 group-focus-within:text-emerald-600 transition-colors">
        <Icon className={`w-4 h-4 ${color}`} />
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={formatNumber(value)}
          onChange={handleInputChange}
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData('text');
            const cleanNum = parseFloat(parseNumber(pastedText)) || 0;
            onChange({ [name]: cleanNum });
            e.preventDefault();
          }}
          disabled={isReadOnly}
          className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-xl font-black disabled:opacity-60 text-right"
          placeholder="0"
          dir="ltr"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
          د.ج
        </div>
      </div>
      
      {!isReadOnly && (
        <div className="flex gap-2 pr-1">
          <button
            type="button"
            onClick={() => handleShortcut(name, 'k')}
            className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 rounded-lg text-xs font-bold transition-all border border-transparent hover:border-emerald-200 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> 000
          </button>
          <button
            type="button"
            onClick={() => handleShortcut(name, 'm')}
            className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 rounded-lg text-xs font-bold transition-all border border-transparent hover:border-emerald-200 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> 000,000
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-50 rounded-full -ml-16 -mt-16 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 font-['Cairo']">إدخال البيانات السنوية</h2>
            <p className="text-slate-500 font-medium">نظام الإدخال الذكي مع تنسيق تلقائي واختصارات سريعة</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-sm font-bold shadow-sm">
            {userRole === UserRole.MERCHANT ? (
              <><UserCheck className="w-5 h-5 text-emerald-600" /> صلاحية كاملة (تاجر)</>
            ) : (
              <><ShieldAlert className="w-5 h-5 text-amber-500" /> عرض فقط (محاسب)</>
            )}
          </div>
        </div>

        {!isReadOnly && (
          <div className="mb-12">
            <VoiceInput onDataParsed={onChange} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
              <h3 className="font-black text-slate-400 text-sm uppercase tracking-widest">التدفق المالي</h3>
            </div>
            <InputField label="إجمالي الدخل السنوي" name="income" value={data.income} icon={Banknote} color="text-emerald-500" />
            <InputField label="إجمالي المصاريف (شخصية وعامة)" name="expenses" value={data.expenses} icon={Landmark} color="text-red-500" />
            <InputField label="أجور العمال السنوية" name="wages" value={data.wages} icon={Users} color="text-blue-500" />
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
              <h3 className="font-black text-slate-400 text-sm uppercase tracking-widest">الأصول والخصوم</h3>
            </div>
            <InputField label="قيمة المخزون الحالي" name="inventory" value={data.inventory} icon={Box} color="text-amber-500" />
            <InputField label="السيولة النقدية" name="liquidity" value={data.liquidity} icon={Banknote} color="text-emerald-500" />
            <InputField label="ديون لنا عند الآخرين" name="debtsToUs" value={data.debtsToUs} icon={HandCoins} color="text-indigo-500" />
            <InputField label="ديون علينا للآخرين" name="debtsByUs" value={data.debtsByUs} icon={AlertCircle} color="text-orange-500" />
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4 text-slate-400">
             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
               <ShieldAlert className="w-5 h-5" />
             </div>
             <p className="text-xs font-bold leading-relaxed max-w-xs">يتم حفظ البيانات تلقائياً في المتصفح، ولكن يفضل الضغط على حفظ لتأكيد السجلات.</p>
           </div>
           {!isReadOnly && (
             <button
              onClick={onSave}
              className="w-full md:w-auto px-12 py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200 active:scale-95"
             >
               <Save className="w-6 h-6" />
               حفظ السجلات المالية
             </button>
           )}
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mb-32 blur-3xl"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
             <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 shadow-xl">
               <Landmark className="w-10 h-10 text-amber-400" />
             </div>
             <div>
               <h4 className="text-xl font-black mb-1">تحديث مرجع نصاب الزكاة</h4>
               <p className="text-slate-400 text-sm font-medium">سعر جرام الذهب الحالي يحدد بلوغ النصاب تلقائياً.</p>
             </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 min-w-[280px]">
            <input 
              type="text" 
              name="goldPrice"
              value={formatNumber(data.goldPrice)}
              onChange={handleInputChange}
              className="bg-transparent text-3xl font-black text-center w-full outline-none text-amber-400"
              dir="ltr"
            />
            <div className="w-px h-10 bg-white/10"></div>
            <span className="text-slate-400 font-bold whitespace-nowrap">د.ج / جرام</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
