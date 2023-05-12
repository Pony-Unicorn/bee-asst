import type { FC } from 'react';
// import clsx from 'clsx';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';
import { Img } from 'react-image';

import { getFavicon } from '../utils/common';
import { IBookmarkItem } from '../store/bookmark';

export type IProps = {
  item: IBookmarkItem;
  action: (id: string) => void;
};

const BookmarkItem: FC<IProps> = ({ item, action }) => {
  const [copyState, copyToClipboard] = useCopyToClipboard();

  return (
    <div className="flex items-center h-12 m-1 px-2 rounded-xl border-2 border-neutral hover:bg-neutral-content">
      <div className="flex items-center cursor-pointer tooltip tooltip-bottom" data-tip={item.u} onClick={() => action(item.i)}>
        <div className="avatar">
          <div className="w-8 h-8">
            <Img src={getFavicon(item.u)} loader={<span>🌏︎</span>} unloader={<span>🌐</span>} alt="bookmark" />
          </div>
        </div>
        <p className="w-28 h-10 overflow-y-auto text-sm mx-1">{item.n}</p>
      </div>
      <button className="btn btn-accent btn-sm p-1" onClick={() => copyToClipboard(item.u)}>
        复制
      </button>
    </div>
  );
};

export default BookmarkItem;
