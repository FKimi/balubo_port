import React from 'react';
import { Link } from 'react-router-dom';
import { Pen, User, Sparkles, LayoutDashboard, LineChart } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="text-primary-600" size={24} />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 text-transparent bg-clip-text">
              Balubo
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <LayoutDashboard size={20} />
              <span>マイページ</span>
            </Link>
            
            <Link
              to="/works/new"
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <Pen size={20} />
              <span>作品を追加</span>
            </Link>
            
            <Link
              to="/analytics"
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <LineChart size={20} />
              <span>分析</span>
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <User size={20} />
              <span>プロフィール</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}