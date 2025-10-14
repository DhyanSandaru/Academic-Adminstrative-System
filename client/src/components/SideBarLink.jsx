// SidebarLink.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SidebarLink({ to, Icon, label }) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors
        ${isActive ? "bg-[#ffc20e] text-[#121c3e]" : "hover:bg-[#253d90] text-white"}
      `}
    >
       <Icon className="w-6 h-6 text-white" />
      <span className='font-semibol text-white'>{label}</span>
    </Link>
  );
}


