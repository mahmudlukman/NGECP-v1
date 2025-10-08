import Title from "./Title";

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center mx-4 my-36">
      <Title
        title="Join Newsletter"
        description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week."
        visibleButton={false}
      />
      <div className="flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200">
        <input
          className="flex-1 pl-4 outline-none bg-transparent"
          type="text"
          placeholder="Enter your email address"
        />
        <button className="font-medium bg-green-500 text-white px-3 sm:px-7 py-3 rounded-full hover:scale-105 active:scale-95 transition text-xs sm:text-sm whitespace-nowrap">
          Get Updates
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
