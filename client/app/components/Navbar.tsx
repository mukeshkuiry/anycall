/* eslint-disable @next/next/no-img-element */
const AnycallNavbar = () => {
  const handleHome = () => {
    window.location.href = "/";
  };
  return (
    <nav className="bg-purple-900 lg:bg-black w-full flex justify-between items-center h-16 lg:h-20 pl-4 lg:pl-0">
      <div className="flex items-center cursor-pointer" onClick={handleHome}>
        <img
          src="https://dl.memuplay.com/new_market/img/com.video.mini.icon.2021-03-18-21-22-39.png"
          alt="Anycall Logo"
          className="w-8 h-8 mr-2"
        />
        <span className="text-white text-lg font-semibold">Anycall</span>
      </div>
      <div>
        <h1 className="text-xl text-white mr-4 font-mono font-bold">
          Talk to strangers
        </h1>
      </div>
    </nav>
  );
};

export default AnycallNavbar;
