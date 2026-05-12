import React from 'react';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="flex items-center justify-between h-24 px-8 border-b border-white/5 bg-[#0f1117]/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher une personne, une caméra, un lieu..." 
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600/30 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6 ml-8">
        <button className="relative p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f1117]"></span>
        </button>
        
        <div className="flex items-center space-x-4 pl-6 border-l border-white/10">
          <div className="text-right">
            <p className="text-sm font-bold text-white leading-none">Officier Admin</p>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-1">Sûreté Nationale</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 p-[2px]">
            <div className="w-full h-full rounded-[10px] bg-[#161922] flex items-center justify-center">
              <span className="text-lg font-bold text-white">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
