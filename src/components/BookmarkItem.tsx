import type { FC } from 'react';
// import clsx from 'clsx';
import copy from 'copy-to-clipboard';

import { getFavicon } from '../utils/common';
import { IBookmarkItem } from '../store/bookmark';

export type IProps = {
  item: IBookmarkItem;
  action: (id: string) => void;
};

const BookmarkItem: FC<IProps> = ({ item, action }) => {
  return (
    <div className="flex items-center h-12 m-2">
      <div className="flex items-center cursor-pointer" onClick={() => action(item.i)}>
        <div className="avatar">
          <div className="w-8 h-8">
            <img src={getFavicon(item.u)} alt="bookmark icon" />
          </div>
        </div>
        <p className="w-28 h-10 overflow-y-auto text-sm mx-1">{item.n}</p>
      </div>
      <button className="btn btn-sm" onClick={() => copy(item.u)}>
        复制
      </button>
    </div>
  );
};

export default BookmarkItem;
