import { FC, useState } from 'react';
import clsx from 'clsx';

import { Inter } from 'next/font/google';

import Notes from '@/components/Notes';
import Kanban from '@/components/Kanban';
import Bookmark from '@/components/Bookmark';

const inter = Inter({ subsets: ['latin'] });

const Home: FC = () => {
  const [tabIndex, setTabIndex] = useState(2); // 0: 笔记, 1: 看板, 2: 书签

  const switchTabHandle = (index: number) => {
    if (tabIndex === index) return;
    setTabIndex(index);
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}>
      <div className="flex flex-col items-center flex-grow container p-4 border-2 border-rose-500">
        <div className="tabs tabs-boxed">
          <button
            className={clsx('btn tab tab-lg tab-bordered mx-2', tabIndex === 0 && 'tab-active')}
            onClick={() => switchTabHandle(0)}
          >
            笔记 N
          </button>
          <button
            className={clsx('btn tab tab-lg tab-bordered mx-2', tabIndex === 1 && 'tab-active')}
            onClick={() => switchTabHandle(1)}
          >
            看板 K
          </button>
          <button
            className={clsx('btn tab tab-lg tab-bordered mx-2', tabIndex === 2 && 'tab-active')}
            onClick={() => switchTabHandle(2)}
          >
            书签 M
          </button>
        </div>
        {[<Notes key={0} />, <Kanban key={1} />, <Bookmark key={2} />][tabIndex]}
      </div>
    </main>
  );
};

export default Home;
