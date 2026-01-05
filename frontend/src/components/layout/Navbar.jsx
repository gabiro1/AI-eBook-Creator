import React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProfileDropDown from './ProfileDropDown'
import { BookOpen, Menu, X } from "lucide-react";


const Navbar = () => {
    const {user, logout, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    
    const navLinks = [
        { name:"Features", href:"#features"},
        {name:"Testimonials", href:"#testimonials"},
    ];

    // close dropdown when clicking outside 
    useEffect(()=>{
        const handleClickOutside = () =>{
            if(profileDropdownOpen){
                setProfileDropdownOpen(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }

    }, [profileDropdownOpen])
  return (
    <header>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
            <div className='flex items-center justify-between h-16'>
                <a href="/" className='flex items-center space-x-2.5 group'> 
                    <div className='w-9 h-9 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105 '>
                        <BookOpen className='h-5 w-5 text-white'/>
                    </div>
                    <span className='text-xl font-semibold text-gray-900 tracking-tight'>AI eBook Creator</span>
                </a>

                {/* Desktop navigation  */}
                <nav className='hidden lg:flex items-center space-x-1'>
                    {navLinks.map((link)=>(
                        <a 
                        key ={link.name}
                        href={link.href}
                        className='px-4 py-4 text-sm font-medium text-gray-600 hover:text-violet-600 rounded-lg hover:bg-violet-50/50 transition-all duration-200 '
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Auth button & Profile  */}
                <div className='hidden lg:flex items-center space-x-3'>
                    {isAuthenticated ? (
                        <ProfileDropDown
                            isOpen={profileDropdownOpen}
                            onToggle = {(e)=> {
                                e.stopPropagation();
                                setProfileDropdownOpen(!profileDropdownOpen);
                            }}
                            avatar={user?.avatar || ""}
                            companyName={user?.name || ""}
                            email={user?.email || ""}
                            userRole={user?.role || ""}
                            onLogout ={()=>console.log("Logout")}
                        />
                    ) : (
                        <>
                            <a href="/login" className='px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-200 '> Login</a>
                            <a href="/signup" className='px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-400 to-purple-500 rounded-lg hover:from-violet-700 hover:to-purple-700  shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-200 hover:scale-105'> Get Started</a>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button  */}
                <button
                    className='lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200'
                    onClick={()=> setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className='h-5 w-5'/> : <Menu className='h-5 w-5'/>}
                </button>
            </div>
        </div>
    </header>
  )
}

export default Navbar