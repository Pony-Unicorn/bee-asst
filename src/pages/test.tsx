import { FC } from 'react';

const Test: FC = () => {
  return (
    <div className="flex flex-col h-40">
      <div className="flex">
        <input className="input input-bordered input-info w-full mx-2" type="text" placeholder="搜索书签" />
      </div>
      <div className="flex flex-1 mt-4">
        <div className="flex flex-col h-full w-48 rounded-2xl border bg-base-300">
          <div className="h-8 w-8"></div>
          <div className="flex flex-col  rounded-b-2xl border-t bg-base-200 overflow-y-auto">
            <div className='overflow-y-auto'>

            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            <div className="h-12 w-20 bg-yellow-500"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
