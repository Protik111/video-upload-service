import Cookies from 'js-cookie'

const UserData = () => {
  const handleLogout = () => {
    Cookies.remove('user-cred')
    window.location.href = '/'
  }

  return (
    <button
      className="text-regular flex items-center gap-1 dark:text-white cursor-pointer border border-theme px-4 py-1 rounded-full"
      onClick={handleLogout}
    >
      <img
        src={'/assets/logout.webp'}
        className="user-img w-6 h-6 rounded-full object-cover object-center"
        alt="user"
      />
      <span className="max-lg:hidden font-sans">Log out</span>
    </button>
  )
}

export default UserData
