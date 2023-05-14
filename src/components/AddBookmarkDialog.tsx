import { FC, useState, ChangeEvent, useEffect } from 'react';
import clsx from 'clsx';
import { shallow } from 'zustand/shallow';
import { useImmer } from 'use-immer';
import { isUrl } from '@/utils/common';

import TagBtn from '@/components/TagBtn';
import { MustBookmarkItem, useBookmarkStore } from '@/store/bookmark';

export type IProps = {
  isOpen: boolean;
  cancel: () => void;
  ok: (item: MustBookmarkItem) => void;
};

const AddBookmarkDialog: FC<IProps> = ({ isOpen, cancel, ok }) => {
  const [name, setName] = useState(''); // 书签名字
  const [url, setUrl] = useState(''); // 书签 URL
  const [tagSelectList, updateTagSelectList] = useImmer<string[]>([]); // 选中的 tag 列表

  const { tags } = useBookmarkStore(
    (state) => ({
      tags: state.tagSet,
    }),
    shallow
  );

  const tagNameInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    setName(evt.target.value);
  };

  const tagUrlInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    setUrl(evt.target.value);
  };

  const tagBtnHandle = (tagId: string) => {
    if (tagSelectList.includes(tagId)) {
      updateTagSelectList(tagSelectList.filter((id) => id != tagId));
    } else {
      updateTagSelectList([...tagSelectList, tagId].sort((a, b) => Number(a) - Number(b)));
    }
  };

  useEffect(() => {
    console.log('AddBookmarkDialog Mounted...');
  }, []);

  return (
    <div className={clsx('modal', isOpen && 'modal-open')}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">添加书签</h3>
        <div className="form-control">
          <label className="input-group">
            <span>网址</span>
            <input type="text" placeholder="" className="input input-bordered" value={url} onChange={tagUrlInputChange} />
          </label>
          <label className="input-group">
            <span>名字</span>
            <input type="text" placeholder="" className="input input-bordered" value={name} onChange={tagNameInputChange} />
          </label>
        </div>
        <div className="flex">
          <p>已有书签分类</p>
          <div className="tooltip tooltip-open tooltip-right" data-tip="tag 规则">
            {/* <span>❔</span> */}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-wrap w-auto h-32 overflow-auto">
          {Object.entries(tags).map(([id, tagName]) => (
            <TagBtn
              key={id}
              id={id}
              name={tagName}
              condition={tagSelectList.some((tag) => tag == id) ? 1 : 0}
              action={tagBtnHandle}
            />
          ))}
        </div>
        <div className="modal-action">
          <button
            className="btn"
            onClick={() => {
              if (!isUrl(url)) return;
              if (name === '' || tagSelectList.length === 0) return;
              ok({ n: name, u: url, t: tagSelectList });
            }}
          >
            添加
          </button>
          <button className="btn" onClick={cancel}>
            取消!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBookmarkDialog;
