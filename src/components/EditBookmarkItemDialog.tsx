import { FC, ChangeEvent, useEffect } from 'react';
import clsx from 'clsx';
import { useImmer } from 'use-immer';
import TagBtn from '@/components/TagBtn';
import { IBookmarkItem, MustBookmarkItem, useBookmarkStore } from '../store/bookmark';
import { shallow } from 'zustand/shallow';

export type IProps = {
  isOpen: boolean;
  info: IBookmarkItem;
  cancel: () => void;
  ok: (id: string, item: MustBookmarkItem) => void;
  del: (id: string) => void;
};

const EditBookmarkItemDialog: FC<IProps> = ({ isOpen, info, cancel, ok, del }) => {
  const [bookmarkItem, updateBookmarkItem] = useImmer<MustBookmarkItem>({ n: info.n, u: info.u, t: info.t });

  const { tags } = useBookmarkStore(
    (state) => ({
      tags: state.tagSet,
    }),
    shallow
  );

  const nameInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    updateBookmarkItem((draft) => {
      draft.n = evt.target.value;
    });
  };

  const urlInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    updateBookmarkItem((draft) => {
      draft.u = evt.target.value;
    });
  };

  const tagBtnHandle = (tagId: string) => {
    if (bookmarkItem.t.includes(tagId)) {
      updateBookmarkItem((draft) => {
        draft.t = bookmarkItem.t.filter((id) => id != tagId);
      });
    } else {
      updateBookmarkItem((draft) => {
        draft.t = [...bookmarkItem.t, tagId].sort((a, b) => Number(a) - Number(b));
      });
    }
  };

  useEffect(() => {
    console.log('EditBookmarkItemDialog Mounted...');
  }, []);

  return (
    <div className={clsx('modal', isOpen && 'modal-open')}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">编辑书签</h3>
        <div className="form-control">
          <label className="input-group">
            <span>名字</span>
            <input
              type="text"
              placeholder=""
              className="input input-bordered"
              value={bookmarkItem.n}
              onChange={nameInputChange}
            />
          </label>
          <label className="input-group">
            <span>网址</span>
            <input
              type="text"
              placeholder=""
              className="input input-bordered"
              value={bookmarkItem.u}
              onChange={urlInputChange}
            />
          </label>
        </div>
        <div className="flex">
          <p>已有书签分类</p>
          <div className="tooltip tooltip-open tooltip-right" data-tip="tag 规则">
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
              condition={bookmarkItem.t.some((tag) => tag == id) ? 1 : 0}
              action={tagBtnHandle}
            />
          ))}
        </div>
        <div className="modal-action">
          <button className="btn" onClick={() => del(info.i)}>
            删除
          </button>
          <button
            className="btn"
            onClick={() => {
              // 目前仅简单校验，后期严格校验、例如： URL 合不合法、
              if (bookmarkItem.n === '' || bookmarkItem.u === '' || bookmarkItem.t.length === 0) return;
              ok(info.i, bookmarkItem);
            }}
          >
            更新
          </button>
          <button className="btn" onClick={cancel}>
            取消!
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookmarkItemDialog;
