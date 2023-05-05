import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';

import Notes from '@/components/Notes';
import Kanban from '@/components/Kanban';
import Bookmark from '@/components/Bookmark';

const inter = Inter({ subsets: ['latin'] });

const Home: FC = () => {
  const router = useRouter();

  const [tabIndex, setTabIndex] = useState(2); // 0: 笔记, 1: 看板, 2: 书签

  const switchTabHandle = (index: number) => {
    if (tabIndex === index) return;
    setTabIndex(index);
  };

  useEffect(() => {
    const token = localStorage.getItem('bee-asst-Bearer');

    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <main className={`flex flex-col items-center h-screen px-4 ${inter.className}`}>
      <div className="flex flex-col flex-1 container py-2">
        <header className="flex justify-between items-center">
          <div className="flex justify-start items-center">
            <div className="w-8 h-8 mr-2 rounded-full">
              <Image src="/images/logo-black.png" alt="logo" width="32" height="32" />
            </div>
            <div className="tabs tabs-boxed">
              <button className={clsx('tab tab-sm', tabIndex === 0 && 'tab-active')} onClick={() => switchTabHandle(0)}>
                笔记 N
              </button>
              <button className={clsx('tab tab-sm', tabIndex === 1 && 'tab-active')} onClick={() => switchTabHandle(1)}>
                看板 K
              </button>
              <button className={clsx('tab tab-sm', tabIndex === 2 && 'tab-active')} onClick={() => switchTabHandle(2)}>
                书签 M
              </button>
            </div>
          </div>
          <div className="">
            <div className="bg-secondary rounded-full">
              <p>My</p>
            </div>
          </div>
        </header>

        <div className="flex flex-1">{[<Notes key={0} />, <Kanban key={1} />, <Bookmark key={2} />][tabIndex]}</div>
      </div>
    </main>
  );
};

export default Home;
