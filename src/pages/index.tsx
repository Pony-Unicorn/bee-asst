import { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import clsx from 'clsx';

import { Inter } from 'next/font/google';

import { shallow } from 'zustand/shallow';
import { useBookmarkStore } from '../store/bookmark';

import TagBtn from '@/components/TagBtn';
import ViewBtn from '@/components/ViewBtn';
import BookmarkItem from '@/components/BookmarkItem';
import AddTagDialog from '@/components/AddTagDialog';
import AddBookmarkDialog from '@/components/AddBookmarkDialog';

const inter = Inter({ subsets: ['latin'] });

const Home: FC<{}> = () => {
  const [tabIndex, setTabIndex] = useState(2); // 0: 笔记, 1: 看板, 2: 书签
  const [isEdit, setEdit] = useState(false); // false: 正常状态, true: 编辑状态

  const [tagSelectList, updateTagSelectList] = useImmer<string[]>([]); // 选中的 tag 列表

  const [addTagDialogOpen, setAddTagDialogOpen] = useState(false); // 添加标签面板的是否打开
  const [addBookmarkDialogOpen, setAddBookmarkDialogOpen] = useState(false); // 添加书签面板的是否打开

  const { addTag, tags, addView, tagViews, bookmarkItems, addBookmarkItem, saveBookmark, loadBookmark } = useBookmarkStore(
    (state) => ({
      addTag: state.addTag,
      tags: state.tags,
      addView: state.addView,
      tagViews: state.view,
      bookmarkItems: state.items,
      addBookmarkItem: state.addItem,
      saveBookmark: state.save,
      loadBookmark: state.load,
    }),
    shallow
  );

  // 等于 tagViews.length 没有任何选中, 为下次添加做准备.其他代表在 tagViews 中的索引
  const tagViewSelectIndex = useMemo(() => {
    for (let i = 0, l = tagViews.length; i < l; i++) {
      if (
        tagSelectList.length === tagViews[i].length &&
        tagSelectList.every((tagId, tagIdIndex) => tagId === tagViews[i][tagIdIndex])
      )
        return i;
    }
    return tagViews.length;
  }, [tagSelectList, tagViews]);

  const switchTabHandle = (index: number) => {
    if (tabIndex === index) return;
    setTabIndex(2);
  };

  const tagBtnHandle = (tagId: string) => {
    if (isEdit) {
      console.log('编辑>>>', tagId);
      return;
    }

    if (tagSelectList.includes(tagId)) {
      updateTagSelectList(tagSelectList.filter((id) => id != tagId));
    } else {
      updateTagSelectList([...tagSelectList, tagId].sort((a, b) => Number(a) - Number(b)));
    }
  };

  const editBtnHandle = () => {
    if (isEdit) updateTagSelectList([]);
    setEdit(!isEdit);
  };

  const resetBtnHandle = () => {
    if (isEdit) setEdit(!isEdit);
    updateTagSelectList([]);
  };

  const onClickBookmarkItem = (id: string) => {
    if (isEdit) {
      console.log('编辑>>>', id);
      return;
    }
    window.open(bookmarkItems[id].u, '_blank');
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}>
      <div className="flex flex-col items-center flex-grow container p-4 border-2 border-rose-500">
        <div className="tabs tabs-boxed">
          <button
            className={clsx('btn tab tab-lg tab-bordered mx-2 tab-disabled', tabIndex === 0 && 'tab-active')}
            onClick={() => switchTabHandle(0)}
          >
            笔记 N
          </button>
          <button
            className={clsx('btn tab tab-lg tab-bordered mx-2 tab-disabled', tabIndex === 1 && 'tab-active')}
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

        <div className="max-w-5xl w-10/12 flex flex-col items-center flex-grow p-6 border-2 border-rose-500">
          <div className="flex w-full m-4">
            <button className="btn" onClick={editBtnHandle}>
              {isEdit ? '取消' : '编辑'}
            </button>
            <input type="text" placeholder="搜索书签" className="input input-bordered input-success w-full" />
            <button className="btn" onClick={resetBtnHandle}>
              重置
            </button>
          </div>

          {/* 视图列表 */}
          <div className="flex items-stretch flex-grow w-full">
            <div className="mockup-window border bg-base-300 flex-none mx-2 w-48">
              <div className="flex justify-center h-full border-t bg-base-200">
                <div className="flex flex-col">
                  {tagViews.map((view, index) => {
                    const viewName = view.map((tagId) => tags[tagId]).join(':');
                    return (
                      <ViewBtn
                        key={viewName}
                        id={index}
                        viewName={viewName}
                        condition={tagViewSelectIndex === index ? 1 : 0}
                        action={(id) => {
                          updateTagSelectList(tagViews[id]);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 书签列表 */}
            <div className="mockup-window border bg-base-300 flex-grow mx-2">
              <div className="flex p-1">
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    setAddBookmarkDialogOpen(true);
                  }}
                >
                  新建
                </button>
              </div>

              <div className="flex w-full h-full border-t bg-base-200">
                <div className="flex flex-wrap content-start overflow-y-auto">
                  {Object.values(bookmarkItems)
                    .filter((bookmarkItem) => tagSelectList.every((tagSelectId) => bookmarkItem.t.includes(tagSelectId)))
                    .map((bookmarkItem) => (
                      <BookmarkItem key={bookmarkItem.i} item={bookmarkItem} action={onClickBookmarkItem} />
                    ))}
                </div>
              </div>
            </div>

            {/* 标签列表 */}
            <div className="mockup-window border bg-base-300 flex-none mx-2 -mr-3">
              <div className="flex p-1">
                <button className="btn btn-sm" onClick={() => setAddTagDialogOpen(true)}>
                  新建
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    if (tagViewSelectIndex === tagViews.length) addView(tagSelectList);
                  }}
                >
                  保存
                </button>

                <button className="btn btn-sm" onClick={() => loadBookmark()}>
                  load
                </button>
                <button className="btn btn-sm" onClick={() => saveBookmark()}>
                  save
                </button>
              </div>

              <div className="flex flex-col h-full border-t bg-base-200">
                <div className="flex flex-wrap w-48">
                  {Object.entries(tags).map(([id, tagName]) => (
                    <TagBtn
                      key={id}
                      id={id}
                      tagName={tagName}
                      condition={isEdit ? 2 : tagSelectList.some((tag) => tag == id) ? 1 : 0}
                      action={tagBtnHandle}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 弹窗容器 */}
      <div>
        {/* 添加书签弹窗 */}
        {addBookmarkDialogOpen && (
          <AddBookmarkDialog
            isOpen={addBookmarkDialogOpen}
            ok={(item) => {
              addBookmarkItem(item);
              setAddBookmarkDialogOpen(false);
            }}
            cancel={() => {
              setAddBookmarkDialogOpen(false);
            }}
          />
        )}
        {/* 添加标签弹窗 */}
        {addTagDialogOpen && (
          <AddTagDialog
            isOpen={addTagDialogOpen}
            ok={(tagName) => {
              addTag(tagName);
              setAddTagDialogOpen(false);
            }}
            cancel={() => {
              setAddTagDialogOpen(false);
            }}
          />
        )}
      </div>
    </main>
  );
};

export default Home;
