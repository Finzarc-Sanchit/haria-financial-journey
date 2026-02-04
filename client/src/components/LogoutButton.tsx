import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-500 hover:text-white text-xl px-8 py-4"
        >
            <LogOut className="w-6 h-6 mr-2" />
            Logout
        </Button>
    );
};

export default LogoutButton;
