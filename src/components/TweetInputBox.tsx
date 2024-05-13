import { EarthIcon, ImageIcon } from 'lucide-react';

export default function TweetInputBox() {
  return (
    <div className="bg-white rounded-xl px-5 py-3">
      <h3 className="font-semibold text-xs">Tweet something</h3>
      <hr className="my-2" />
      <div className="flex space-x-3">
        <div className="w-10 h-10 bg-blue-200 rounded-lg" />

        <div className="flex-1">
          <textarea
            className="w-full py-2 focus:outline-none"
            placeholder="What's happening?"
          />
          <div className="flex">
            <button>
              <ImageIcon className="text-blue-500" size={20} />
            </button>
            <button className="text-blue-500 flex items-center font-medium text-xs space-x-1 ml-2">
              <EarthIcon size={20} />
              <p>Everyone can reply</p>
            </button>
            <button className="bg-blue-500 rounded text-white font-medium text-xs py-2 px-6 ml-auto">
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
