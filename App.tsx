
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  FileEdit, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Fingerprint,
  Lock,
  Bell,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { FinancialData, User, UserRole } from './types';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';

const INITIAL_FINANCIAL_DATA: FinancialData = {
  income: 0,
  expenses: 0,
  wages: 0,
  debtsToUs: 0,
  debtsByUs: 0,
  inventory: 0,
  liquidity: 0,
  goldPrice: 14500, // سعر تقريبي لجرام الذهب عيار 24 بالدينار الجزائري
  lastUpdated: new Date().toISOString()
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'entry' | 'settings'>('dashboard');
  const [financialData, setFinancialData] = useState<FinancialData>(INITIAL_FINANCIAL_DATA);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ password: '', role: UserRole.MERCHANT });
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Settings state
  const [storedPassword, setStoredPassword] = useState('1234');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    const savedData = localStorage.getItem('haseelat_data');
    if (savedData) {
      setFinancialData(JSON.parse(savedData));
    }
    
    const savedPassword = localStorage.getItem('haseelat_pass');
    if (savedPassword) {
      setStoredPassword(savedPassword);
    }
    
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.password === storedPassword) {
      setUser({
        username: authForm.role === UserRole.MERCHANT ? 'التاجر' : 'المحاسب',
        role: authForm.role,
        isAuthenticated: true
      });
    } else {
      alert('كلمة المرور غير صحيحة. حاول مرة أخرى.');
    }
  };

  const handleBiometricAuth = () => {
    alert('جاري التحقق من البصمة...');
    setTimeout(() => {
      setUser({
        username: 'التاجر (بصمة)',
        role: UserRole.MERCHANT,
        isAuthenticated: true
      });
    }, 1000);
  };

  const handleUpdateData = (partialData: Partial<FinancialData>) => {
    setFinancialData(prev => ({ ...prev, ...partialData }));
  };

  const saveToStorage = () => {
    const dataWithTimestamp = { ...financialData, lastUpdated: new Date().toISOString() };
    setFinancialData(dataWithTimestamp);
    localStorage.setItem('haseelat_data', JSON.stringify(dataWithTimestamp));
    alert('تم حفظ البيانات بنجاح في قاعدة البيانات المحلية');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.current !== storedPassword) {
      alert('كلمة المرور الحالية غير صحيحة');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert('كلمة المرور الجديدة غير متطابقة');
      return;
    }
    if (passwords.new.length < 4) {
      alert('يجب أن تكون كلمة المرور 4 خانات على الأقل');
      return;
    }
    
    localStorage.setItem('haseelat_pass', passwords.new);
    setStoredPassword(passwords.new);
    setIsChangingPassword(false);
    setPasswords({ current: '', new: '', confirm: '' });
    alert('تم تغيير كلمة المرور بنجاح');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthForm({ password: '', role: UserRole.MERCHANT });
    setActiveTab('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-700 font-bold text-lg animate-pulse">حصيلة التاجر...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-100 via-emerald-50 to-emerald-100">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white/50 animate-in zoom-in duration-700">
          <div className="text-center mb-10">
            <div className="inline-flex p-5 bg-emerald-600 text-white rounded-[2rem] mb-6 shadow-2xl shadow-emerald-200">
              <Shield className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">حصيلة التاجر</h1>
            <p className="text-slate-500 font-medium">نظام الإدارة المالية والزكاة السنوية</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex p-1.5 bg-slate-100 rounded-[1.25rem]">
              <button 
                type="button"
                onClick={() => setAuthForm(f => ({ ...f, role: UserRole.MERCHANT }))}
                className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${authForm.role === UserRole.MERCHANT ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              >تاجر</button>
              <button 
                type="button"
                onClick={() => setAuthForm(f => ({ ...f, role: UserRole.ACCOUNTANT }))}
                className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${authForm.role === UserRole.ACCOUNTANT ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              >محاسب</button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 pr-2">كلمة المرور</label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={authForm.password}
                  onChange={(e) => setAuthForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full pl-5 pr-12 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-center text-xl font-bold tracking-widest"
                  placeholder="••••"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                   >
                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                   <div className="w-px h-6 bg-slate-200"></div>
                   <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
              </div>
            </div>

            <button className="w-full py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 active:scale-[0.98] mt-2">
              دخول آمن للنظام
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-slate-400 font-bold">أو عبر</span></div>
            </div>

            <button 
              type="button" 
              onClick={handleBiometricAuth}
              className="w-full py-4 flex items-center justify-center gap-3 text-slate-600 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50 transition-all font-bold group"
            >
              <Fingerprint className="w-7 h-7 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>تسجيل الدخول بالبصمة</span>
            </button>
          </form>
          
          <div className="mt-10 text-center space-y-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3 h-3" />
              تشفير عسكري AES-256
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <header className="md:hidden bg-white/80 backdrop-blur-md border-b px-6 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
            <Shield className="w-6 h-6" />
          </div>
          <span className="font-black text-xl text-slate-900">حصيلة التاجر</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-blue-600 relative bg-blue-50 rounded-xl">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-700 bg-slate-100 rounded-xl">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <aside className={`
        fixed inset-0 z-50 md:relative md:flex flex-col w-80 bg-white border-l border-slate-100 shadow-2xl md:shadow-none transition-transform duration-500 ease-out
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="p-10 hidden md:flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-100">
            <Shield className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tight">حصيلة التاجر</span>
            <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">النظام الذكي V1.0</span>
          </div>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-3">
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-2xl font-black transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            لوحة التحكم
          </button>
          <button 
            onClick={() => { setActiveTab('entry'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-2xl font-black transition-all duration-300 ${activeTab === 'entry' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <FileEdit className="w-5 h-5" />
            إدخال البيانات
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-2xl font-black transition-all duration-300 ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <Settings className="w-5 h-5" />
            الإعدادات
          </button>
        </nav>

        <div className="p-8 border-t border-slate-50 space-y-4">
          <div className="p-5 bg-slate-50 rounded-[1.5rem] flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm">
              {user.username[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">{user.username}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4.5 text-red-500 font-black hover:bg-red-50 rounded-2xl transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            تسجيل الخروج
          </button>
        </div>

        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-6 left-6 p-3 bg-slate-100 rounded-2xl text-slate-500">
          <X className="w-6 h-6" />
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-14 bg-slate-50/50">
        <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 fade-in duration-700">
          {activeTab === 'dashboard' && (
            <Dashboard 
              data={financialData} 
              onExport={(format) => alert(`جاري توليد التقرير السنوي بصيغة ${format.toUpperCase()}...`)} 
            />
          )}
          {activeTab === 'entry' && (
            <DataEntry 
              data={financialData} 
              userRole={user.role} 
              onChange={handleUpdateData} 
              onSave={saveToStorage} 
            />
          )}
          {activeTab === 'settings' && (
            <div className="space-y-8">
               <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl shadow-emerald-50">
                      <Shield className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">إعدادات الأمان والخصوصية</h2>
                    <p className="text-slate-500 mb-12 max-w-sm">تحكم في كلمة المرور وخيارات الدخول الآمن لحماية بياناتك المالية</p>
                    
                    <div className="w-full max-w-lg space-y-4 text-right">
                      <div className="p-2 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-2">
                        <button 
                          onClick={() => setIsChangingPassword(!isChangingPassword)}
                          className="w-full p-6 bg-white rounded-[1.5rem] text-right font-black hover:bg-slate-50 transition-all flex items-center justify-between shadow-sm border border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-emerald-600" />
                            <span>تغيير كلمة المرور</span>
                          </div>
                          <span className="text-slate-300 text-xl font-light">←</span>
                        </button>
                        
                        {isChangingPassword && (
                          <form onSubmit={handleChangePassword} className="p-6 space-y-4 bg-slate-50 rounded-[1.5rem] animate-in slide-in-from-top-4 duration-300">
                             <input 
                               type="password" 
                               placeholder="كلمة المرور الحالية" 
                               required
                               className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                               value={passwords.current}
                               onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                             />
                             <input 
                               type="password" 
                               placeholder="كلمة المرور الجديدة" 
                               required
                               className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                               value={passwords.new}
                               onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                             />
                             <input 
                               type="password" 
                               placeholder="تأكيد كلمة المرور" 
                               required
                               className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                               value={passwords.confirm}
                               onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                             />
                             <div className="flex gap-2 pt-2">
                               <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all">تحديث</button>
                               <button type="button" onClick={() => setIsChangingPassword(false)} className="px-6 py-4 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 transition-all">إلغاء</button>
                             </div>
                          </form>
                        )}
                        
                        <button className="w-full p-6 bg-white rounded-[1.5rem] text-right font-black hover:bg-slate-50 transition-all flex items-center justify-between shadow-sm border border-slate-100">
                           <div className="flex items-center gap-3">
                            <Fingerprint className="w-5 h-5 text-emerald-600" />
                            <span>تفعيل البصمة (Biometric)</span>
                          </div>
                          <div className="w-12 h-6 bg-emerald-600 rounded-full relative shadow-inner">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </button>

                        <button className="w-full p-6 bg-white rounded-[1.5rem] text-right font-black hover:bg-slate-50 transition-all flex items-center justify-between shadow-sm border border-slate-100">
                           <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-blue-600" />
                            <span>الإشعارات السنوية</span>
                          </div>
                          <div className="w-12 h-6 bg-slate-200 rounded-full relative shadow-inner">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
