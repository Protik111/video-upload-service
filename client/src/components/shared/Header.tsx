import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white py-3.5 shadow-md shadow-black/10 z-[1024] dark:bg-darkRaisin">
      <div className="container lg:flex justify-between md:items-center">
        <div className="brand-logo text-center">
          <img
            src="/assets/logo.png"
            className="w-16 lg:w-24 dark:hidden"
            alt="shironam.com"
            width="138"
            height="52"
          />
        </div>

        <div className="right_nav_controls self-center max-lg:-mt-8">
          <ul className="flex flex-row items-center gap-2 sm:gap-4 md:gap-4 dark:text-white">
            <li className="ml-auto hover:border border-theme px-4 py-1 rounded-full cursor-pointer">
              <Link to="/videos" className="text-md dark:text-white">
                <span>Videos</span>
              </Link>
            </li>
            <li className="ml-auto hover:border border-theme px-4 py-1 rounded-full cursor-pointer">
              <Link to="/video-upload" className="text-md dark:text-white">
                <span>Upload</span>
              </Link>
            </li>

            <li className="ml-auto border border-theme px-4 py-1 rounded-full cursor-pointer">
              <Link to="/login" className="text-md dark:text-white">
                <span>Login</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header
