import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileSpreadsheet, ClipboardList, Menu, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { to: '/', label: 'Templates', icon: FileSpreadsheet },
    { to: '/inspections', label: 'Inspections', icon: ClipboardList },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const NavItems = () => (
    <>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-md',
              'transition-colors duration-150 ease-in-out',
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )
          }
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">InspectWise</h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <NavItems />
            </nav>
            <div className="p-4">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full justify-start text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">InspectWise</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-gray-600 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <h1 className="text-xl font-bold text-gray-900">InspectWise</h1>
                </div>
                <nav className="mt-8 flex-1 px-2 space-y-1">
                  <NavItems />
                </nav>
                <div className="p-4">
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full justify-start text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}