import React, { useState, useEffect } from 'react';
import {
  Home, LayoutGrid, Search, ShoppingCart, MoreHorizontal, ChevronDown, ChevronLeft,
  ChevronRight, Sun, Moon, X, Tv, Smartphone, Laptop, Settings, User, LogOut
} from 'lucide-react';

// Main component 
export default function Navbar() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  // Effect to update the view based on window size
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isDesktop ? <DesktopNavbar /> : <MobileNavbar />}
    </>
  );
}

// Data for navigation items
const navItems = [
  { name: 'Home', icon: Home, path: '#' },
  { name: 'Cart', icon: ShoppingCart, path: '#' },
  { name: 'Profile', icon: User, path: '#' },
  { name: 'Settings', icon: Settings, path: '#' },
];

const categoryItems = [
    { name: 'TV', icon: Tv, path: '#' },
    { name: 'Mobile', icon: Smartphone, path: '#' },
    { name: 'Laptop', icon: Laptop, path: '#' },
];


// --- NAVBAR COMPONENT ---
const DesktopNavbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // New handler for the Category item click
  const handleCategoryClick = () => {
    if (isCollapsed) {
      // If the sidebar is collapsed, expand it and open the category dropdown
      setIsCollapsed(false);
      setIsCategoryOpen(true);
    } else {
      // Otherwise, just toggle the dropdown
      setIsCategoryOpen(!isCategoryOpen);
    }
  };

  return (
    <aside className={`sticky top-0 left-0 h-dvh bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-all duration-300 ease-in-out z-50 overflow-hidden ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Header with Logo and Collapse Toggle */}
        <div className={`flex items-center border-b border-slate-200 dark:border-slate-700 ${isCollapsed ? 'justify-center p-4' : 'justify-between p-4'}`}>
          <span className={`text-xl font-bold transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>BrandName</span>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 flex-shrink-0">
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-grow p-2">
          <ul className="space-y-2">
            {/* Search Item */}
             <li>
                <div className="relative">
                  <div className={`flex items-center p-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer`}>
                      <Search className="flex-shrink-0 w-6 h-6" />
                      <span className={`ml-4 font-medium flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>Search</span>
                  </div>
                </div>
            </li>
            {/* Category Dropdown */}
            <li>
                {/* The onClick now uses the new handler */}
                <div onClick={handleCategoryClick} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                    <div className="flex items-center">
                        <LayoutGrid className="flex-shrink-0 w-6 h-6" />
                        <span className={`ml-4 font-medium transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>Category</span>
                    </div>
                    <ChevronDown className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'} ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </div>
                {/* The rendering logic for the dropdown remains the same */}
                {isCategoryOpen && !isCollapsed && (
                    <ul className="mt-1 ml-6 space-y-1">
                        {categoryItems.map(item => (
                            <li key={item.name}>
                                <a href={item.path} className="flex items-center p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-sm">
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
             {/* Other Nav Items */}
             {navItems.map(item => (
                <li key={item.name}>
                    <a href={item.path} className="flex items-center p-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800">
                        <item.icon className="flex-shrink-0 w-6 h-6" />
                        <span className={`ml-4 font-medium transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>{item.name}</span>
                    </a>
                </li>
            ))}
          </ul>
        </nav>

        {/* Footer with Theme Toggle and Logout */}
        <div className="p-2 border-t border-slate-200 dark:border-slate-700">
          <ul className="space-y-2">
            <li>
              <button onClick={toggleTheme} className="flex items-center w-full p-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800">
                {theme === 'light' ? <Moon className="w-6 h-6 flex-shrink-0"/> : <Sun className="w-6 h-6 flex-shrink-0"/>}
                <span className={`ml-4 font-medium transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>Toggle Theme</span>
              </button>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50">
                <LogOut className="w-6 h-6 flex-shrink-0" />
                <span className={`ml-4 font-medium transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};


// Mobile Bottom Navbar
const MobileNavbar = () => {
    const [activeMenu, setActiveMenu] = useState(null); // 'category', 'more', 'search'

    const handleMenuClick = (menu) => {
        setActiveMenu(prev => (prev === menu ? null : menu));
    };

    const closeAllPopups = () => setActiveMenu(null);

    return (
        <div className="md:hidden">
            {/* Top Logo */}
            <header className="fixed top-0 left-0 right-0 h-14 px-4 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-start z-40 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">BrandName</h1>
            </header>

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center z-50">
                <MobileNavItem icon={Home} label="Home" href="#" />
                <MobileNavItem icon={LayoutGrid} label="Category" onClick={() => handleMenuClick('category')} isActive={activeMenu === 'category'} />
                <MobileNavItem icon={Search} label="Search" onClick={() => handleMenuClick('search')} isActive={activeMenu === 'search'} />
                <MobileNavItem icon={ShoppingCart} label="Cart" href="#" />
                <MobileNavItem icon={MoreHorizontal} label="More" onClick={() => handleMenuClick('more')} isActive={activeMenu === 'more'} />
            </nav>

            {/* Backdrop for popups */}
            {activeMenu && activeMenu !== 'search' && (
                <div onClick={closeAllPopups} className="fixed inset-0 bg-black/40 z-30" />
            )}

            {/* Popups */}
            {activeMenu === 'category' && <MobilePopup items={categoryItems} onClose={closeAllPopups} />}
            {activeMenu === 'more' && <MobilePopup items={navItems} onClose={closeAllPopups} />}
            {activeMenu === 'search' && <SearchOverlay onClose={closeAllPopups} />}

            {/* This empty div prevents content from being hidden behind the fixed bottom navbar */}
            <div className="h-auto"></div> 
        </div>
    );
};

// Reusable component for mobile nav items
const MobileNavItem = ({ icon: Icon, label, onClick, href, isActive }) => (
    <a href={href} onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full text-xs transition-colors duration-200 ${isActive ? 'text-indigo-500' : 'text-slate-500 dark:text-slate-400'}`}>
        <Icon className="w-6 h-6 mb-1" />
        <span>{label}</span>
    </a>
);

// Popup menu for Mobile (Category & More)
const MobilePopup = ({ items,  }) => {
    return (
        <div className="fixed bottom-20 left-1/2 w-[90vw] max-w-sm bg-slate-200 dark:bg-slate-800 rounded-2xl shadow-lg p-4 z-40 animate-slide-up">
            <div className="grid grid-cols-4 gap-4">
                {items.map(item => (
                    <a key={item.name} href={item.path} className="flex flex-col items-center justify-center text-center text-slate-700 dark:text-slate-300 rounded-lg p-2 hover:bg-slate-300 dark:hover:bg-slate-700">
                        <div className="p-3 bg-slate-300 dark:bg-slate-700 rounded-full mb-2">
                           <item.icon className="w-5 h-5"/>
                        </div>
                        <span className="text-xs font-medium">{item.name}</span>
                    </a>
                ))}
            </div>
        </div>
    )
};

// Full-screen Search Overlay for Mobile
const SearchOverlay = ({ onClose }) => {
    const { theme, toggleTheme } = useTheme();

    // Focus the input when the component mounts
    useEffect(() => {
        document.getElementById('mobile-search-input')?.focus();
    }, []);

    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-slate-900 z-50 animate-fade-in">
            <div className="flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800">
                <input
                    id="mobile-search-input"
                    type="text"
                    placeholder="Search for products..."
                    className="w-full h-full bg-transparent focus:outline-none text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
                />
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 ml-2">
                    {theme === 'light' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                </button>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 ml-2">
                    <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </button>
            </div>
            {/* You can add search results or suggestions here */}
            <div className="p-4 text-center text-slate-500">
                <p>Start typing to see results</p>
            </div>
        </div>
    );
};

// Custom hook for managing and applying the theme
function useTheme() {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first, then system preference, default to dark
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
}