import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, FileSpreadsheet } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navigation() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Templates', icon: FileSpreadsheet },
    { to: '/inspections', label: 'Inspections', icon: ClipboardList },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center space-x-2 text-gray-600 hover:text-gray-900',
                  location.pathname === to && 'text-blue-600'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}