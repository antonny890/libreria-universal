import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, BookOpen, Key, Mail, User, Shield, Sparkles, Check, ArrowRight, Star } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser } = useLibrary();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    loginUser(email, password, name.trim() ? name : undefined);
  };

  const handleQuickFillClient = () => {
    setEmail('lector.soñador@gmail.com');
    setPassword('lector123');
    setName('Sofía Mendoza');
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@universal.com');
    setPassword('admin123');
    setName('Administrador Principal');
  };

  const handleGoogleAccountSelect = (googleEmail: string, googleName: string) => {
    loginUser(googleEmail, 'google_oauth_token', googleName);
    setShowGooglePicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FDFBF7] rounded-2xl max-w-md w-full border border-[#2C1E14]/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-6 text-center border-b border-[#2C1E14]/10 bg-[#FAF8F5]">
          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setShowGooglePicker(false);
            }}
            className="absolute top-4 right-4 p-1.5 rounded-md text-[#7A6858] hover:text-[#2C1E14] hover:bg-[#EFEAE0] transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-[#2C1E14] text-[#D4AF37] rounded-xl flex items-center justify-center mx-auto mb-2.5 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#2C1E14]">
            Librería Universal
          </h2>
          <p className="text-xs text-[#7A6858] mt-0.5">
            Portal de Acceso para Lectores &amp; Miembros del Círculo
          </p>

          {/* Tab selector */}
          <div className="flex border border-[#2C1E14]/15 rounded-lg p-0.5 bg-[#F2ECE1] mt-4 text-xs font-semibold">
            <button
              onClick={() => {
                setTab('login');
                setShowGooglePicker(false);
              }}
              className={`flex-1 py-1.5 rounded transition-all ${
                tab === 'login' ? 'bg-white text-[#2C1E14] shadow-xs' : 'text-[#695545]'
              }`}
            >
              Iniciar Sesión (Lector)
            </button>
            <button
              onClick={() => {
                setTab('register');
                setShowGooglePicker(false);
              }}
              className={`flex-1 py-1.5 rounded transition-all ${
                tab === 'register' ? 'bg-white text-[#2C1E14] shadow-xs' : 'text-[#695545]'
              }`}
            >
              Crear Cuenta Nueva
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* GOOGLE SIGN IN BUTTON */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowGooglePicker(!showGooglePicker)}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF8F5] border border-[#2C1E14]/20 rounded-lg text-xs font-semibold text-[#2C1E14] flex items-center justify-center gap-2.5 transition-colors shadow-xs cursor-pointer"
            >
              {/* Google Colorful Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google / Gmail</span>
            </button>

            {/* Google Account Selector Dropdown/Modal (Preferential order: Lector first) */}
            {showGooglePicker && (
              <div className="bg-[#F4EFE6] p-3 rounded-lg border border-[#2C1E14]/15 space-y-2 animate-in fade-in duration-150">
                <p className="text-[10px] text-[#7A6858] uppercase tracking-wider font-semibold">
                  Seleccione su cuenta de Google:
                </p>

                {/* Option 1 (PREFERENTIAL / FIRST): Client Gmail */}
                <button
                  type="button"
                  onClick={() =>
                    handleGoogleAccountSelect(
                      'lector.universal@gmail.com',
                      'Alejandro Morales'
                    )
                  }
                  className="w-full p-2.5 bg-white hover:bg-amber-50/80 rounded border-2 border-[#C88A2E] flex items-center justify-between text-left transition-colors shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#2C1E14] text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-inner">
                      L
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-[#2C1E14] text-xs">lector.universal@gmail.com</p>
                        <span className="bg-[#C88A2E] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                          Preferencial
                        </span>
                      </div>
                      <p className="text-[10px] text-[#695545]">Alejandro Morales · Cuenta Lector / Comprador</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C88A2E]" />
                </button>

                {/* Option 2: Admin Gmail */}
                <button
                  type="button"
                  onClick={() =>
                    handleGoogleAccountSelect(
                      'admin.libreria@gmail.com',
                      'Administrador Principal'
                    )
                  }
                  className="w-full p-2 bg-[#FAF8F5] hover:bg-white rounded border border-[#2C1E14]/15 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#422C1D] text-white/90 flex items-center justify-center font-bold text-xs">
                      A
                    </div>
                    <div>
                      <p className="font-medium text-[#2C1E14] text-xs">admin.libreria@gmail.com</p>
                      <p className="text-[10px] text-[#7A6858] flex items-center gap-1">
                        <Shield className="w-3 h-3 text-[#7A6858]" />
                        <span>Acceso Gestión de Biblioteca (Rol Admin)</span>
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C7A6B]" />
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#2C1E14]/10 w-full" />
            <span className="bg-[#FDFBF7] px-3 text-[10px] uppercase tracking-wider text-[#8C7A6B] font-semibold shrink-0">
              o ingresar con su correo
            </span>
            <div className="border-t border-[#2C1E14]/10 w-full" />
          </div>

          {/* Reader-first Welcome Note */}
          <div className="p-3 rounded-lg bg-[#F4EFE6] border border-[#2C1E14]/10 text-[11px] text-[#695545] leading-relaxed flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-[#C88A2E] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#2C1E14]">Acceso para Lectores y Clientes</p>
              <p className="text-[10px] text-[#7A6858] mt-0.5">
                Inicie sesión para adquirir obras, acumular puntos y dar seguimiento a sus envíos. (Los administradores también pueden identificarse aquí con su correo asignado).
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === 'register' && (
              <div>
                <label className="font-semibold text-[#5A4738] block mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Sofía Mendoza"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-semibold text-[#5A4738] block mb-1">
                Correo Electrónico (Gmail o personal)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lector@gmail.com o su correo"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#5A4738] block mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                />
              </div>
            </div>

            {/* Quick Demo Autofill Chips (PREFERENTIAL: LECTOR FIRST) */}
            <div className="pt-1 space-y-1">
              <span className="text-[10px] text-[#7A6858] font-semibold block">
                Accesos de prueba rápidos:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* 1st Chip (PREFERENTIAL): Lector */}
                <button
                  type="button"
                  onClick={handleQuickFillClient}
                  className="p-2 bg-[#FFFDF9] hover:bg-amber-50/70 border-2 border-[#C88A2E] rounded-lg text-[10px] text-[#2C1E14] font-semibold text-left transition-colors flex items-center justify-between shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-[#C88A2E] shrink-0" />
                    <span className="truncate">Cuenta Lector</span>
                  </div>
                  <span className="text-[8px] bg-[#C88A2E] text-white px-1 rounded uppercase font-bold">
                    ★
                  </span>
                </button>

                {/* 2nd Chip: Admin */}
                <button
                  type="button"
                  onClick={handleQuickFillAdmin}
                  className="p-2 bg-white hover:bg-[#F2ECE1] border border-[#2C1E14]/15 rounded-lg text-[10px] text-[#5A4738] font-medium text-left transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3 h-3 text-[#7A6858] shrink-0" />
                  <span className="truncate">Cuenta Admin</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#2C1E14] hover:bg-[#C88A2E] text-white font-semibold rounded-lg shadow-sm transition-colors text-xs mt-3 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{tab === 'login' ? 'Entrar a Mi Cuenta de Lector' : 'Registrarme en la Librería'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
