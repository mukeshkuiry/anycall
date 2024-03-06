/* eslint-disable @next/next/no-img-element */
const AnycallNavbar = () => {
  return (
    <nav className="bg-purple-900 w-full py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="https://dl.memuplay.com/new_market/img/com.video.mini.icon.2021-03-18-21-22-39.png"
          alt="Anycall Logo"
          className="w-8 h-8 mr-2"
        />
        <span className="text-white text-lg font-semibold">Anycall</span>
      </div>
    </nav>
  );
};

export default AnycallNavbar;
