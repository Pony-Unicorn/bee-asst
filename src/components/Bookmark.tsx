import { FC, useState, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { shallow } from 'zustand/shallow';
import axios from 'axios';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { useBookmarkStore, IBookmarkItem } from '@/store/bookmark';
import TagBtn from '@/components/TagBtn';
import ComboTagBtn from '@/components/ComboTagBtn';
import BookmarkItem from '@/components/BookmarkItem';
import AddTagDialog from '@/components/AddTagDialog';
import AddBookmarkDialog from '@/components/AddBookmarkDialog';
import EditComboTagDialog from '@/components/EditComboTagDialog';
import EditTagDialog from '@/components/EditTagDialog';
import EditBookmarkItemDialog from '@/components/EditBookmarkItemDialog';
import apiRouteMap from '@/constants/apiRouteMap';

const Bookmark: FC = () => {
  const router = useRouter();

  const [isEdit, setEdit] = useState(false); // false: 正常状态, true: 编辑状态

  const [tagSelectList, updateTagSelectList] = useImmer<string[]>([]); // 选中的 tag 列表

  const [addTagDialogOpen, setAddTagDialogOpen] = useState(false); // 添加标签面板的是否打开
  const [addBookmarkDialogOpen, setAddBookmarkDialogOpen] = useState(false); // 添加书签面板的是否打开

  const [editTagViewDialog, setEditTagViewDialog] = useImmer({ isOpen: false, id: -1 }); // 编辑标签视图数据
  const [editTagDialog, setEditTagDialog] = useImmer({ isOpen: false, id: '' }); // 编辑标签数据
  const [editBookmarkItemDialog, setEditBookmarkItemDialog] = useImmer({ isOpen: false, id: '' }); // 编辑标签数据

  const [isSynching, setSynching] = useState(false);

  const {
    addTag,
    rmTag,
    editTag,
    tagSet,
    addComboTag,
    rmComboTag,
    comboTagSet,
    bookmarkItems,
    editBookmarkItem,
    rmBookmarkItem,
    addBookmarkItem,
    saveBookmark,
    initData,
    state,
    changeState,
  } = useBookmarkStore(
    (state) => ({
      addTag: state.addTag,
      rmTag: state.rmTag,
      editTag: state.editTag,
      tagSet: state.tagSet,
      addComboTag: state.addComboTag,
      rmComboTag: state.rmComboTag,
      comboTagSet: state.comboTagSet,
      bookmarkItems: state.items,
      addBookmarkItem: state.addItem,
      editBookmarkItem: state.editItem,
      rmBookmarkItem: state.rmItem,
      saveBookmark: state.save,
      initData: state.initData,
      state: state.state,
      changeState: state.changeState,
    }),
    shallow
  );

  // 等于 tagViews.length 没有任何选中, 为下次添加做准备.其他代表在 comboTagSet 中的索引
  const tagViewSelectIndex = useMemo(() => {
    for (let i = 0, l = comboTagSet.length; i < l; i++) {
      if (
        tagSelectList.length === comboTagSet[i].length &&
        tagSelectList.every((tagId, tagIdIndex) => tagId === comboTagSet[i][tagIdIndex])
      ) {
        return i;
      }
    }
    return comboTagSet.length;
  }, [tagSelectList, comboTagSet]);

  const loadBookmark = async () => {
    const token = localStorage.getItem('bee-asst-Bearer');

    if (!token) {
      router.replace('/login');
    }

    if (state === 'loading') return;
    changeState('loading');

    try {
      const jsonData = await axios
        .get(apiRouteMap.bookmark, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data);

      if (jsonData.data) {
        const bookmark = JSON.parse(jsonData.data.bookmark);
        bookmark.comboTagSet = bookmark.comboTagSet.map((comboTag: number[]) => comboTag.map((tag) => String(tag)));
        bookmark.items = (bookmark.items as IBookmarkItem[]).reduce((pre, cur) => {
          pre[cur.i] = cur;
          return pre;
        }, {} as Record<string, IBookmarkItem>);
        console.log(bookmark);
        initData(bookmark, { lastReadTime: jsonData.data.readTime });
      }
      changeState('success');
    } catch (err) {
      changeState('fail');
      console.error('load BookmarkStore fail >>>', err);
    }
  };

  useEffect(() => {
    loadBookmark();
  }, []);

  const tagBtnHandle = (tagId: string) => {
    if (isEdit) {
      console.log('编辑>>>', tagId);
      setEditTagDialog({ isOpen: true, id: tagId });
      return;
    }

    if (tagSelectList.includes(tagId)) {
      updateTagSelectList(tagSelectList.filter((id) => id != tagId));
    } else {
      updateTagSelectList([...tagSelectList, tagId].sort((a, b) => Number(a) - Number(b)));
    }
  };

  const editBtnHandle = () => {
    updateTagSelectList([]);
    setEdit(!isEdit);
  };

  const resetBtnHandle = () => {
    if (isEdit) setEdit(!isEdit);
    updateTagSelectList([]);
  };

  const onClickBookmarkItem = (id: string) => {
    if (isEdit) {
      console.log('编辑>>>', id);
      setEditBookmarkItemDialog({ isOpen: true, id });
      return;
    }
    window.open(bookmarkItems[id].u, '_blank');
  };

  const onClickComboTagBtn = (id: number) => {
    if (isEdit) {
      console.log('编辑>>>', id);
      setEditTagViewDialog({ isOpen: true, id });
      return;
    }
    updateTagSelectList(comboTagSet[id]);
  };

  const autoSynching = async () => {
    setSynching(true);
    try {
      await saveBookmark();
    } catch (err) {
      console.log(err);
      await loadBookmark();
    }
    setSynching(false);
  };

  // border-2 border-red-500
  return (
    <>
      <div className="flex flex-col justify-center w-full max-w-screen-xl py-4 mx-auto">
        <div className="flex">
          <button className="btn" onClick={editBtnHandle}>
            {isEdit ? '取消' : '编辑'}
          </button>
          <input className="input input-bordered input-info w-full mx-2" type="text" placeholder="搜索书签" />
          <button className="btn" onClick={resetBtnHandle}>
            重置
          </button>
        </div>

        <div className="flex flex-grow mt-4">
          {/* 组合 tag 列表 */}
          <div className="flex flex-col flex-none w-48 rounded-2xl border bg-base-300">
            <div className="h-8 w-8"></div>
            <div className="flex flex-grow min-h-0 h-0 rounded-b-2xl border-t bg-base-200">
              <div className="flex flex-col items-center overflow-y-auto">
                {comboTagSet.map((view, index) => {
                  const viewName = view.map((tagId) => tagSet[tagId]).join(':');
                  return (
                    <ComboTagBtn
                      key={view.join(':')}
                      id={index}
                      comboTagName={viewName}
                      condition={tagViewSelectIndex === index ? 1 : 0}
                      action={onClickComboTagBtn}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 书签列表 */}
          <div className="flex flex-col flex-1 mx-2 rounded-2xl border bg-base-300">
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

            <div className="flex flex-grow min-h-0 h-0 rounded-b-2xl border-t bg-base-200">
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
          <div className="flex flex-col flex-none w-48 rounded-2xl border bg-base-300">
            <div className="flex p-1">
              <button className="btn btn-sm" onClick={() => setAddTagDialogOpen(true)}>
                新建
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  if (tagViewSelectIndex === comboTagSet.length) {
                    addComboTag(tagSelectList);
                    autoSynching();
                  }
                }}
              >
                保存
              </button>

              <button className={clsx('btn btn-sm', isSynching && 'loading')} onClick={autoSynching}>
                同步
              </button>
            </div>

            <div className="flex flex-col flex-grow min-h-0 h-0 rounded-b-2xl border-t bg-base-200">
              <div className="flex flex-wrap overflow-y-auto">
                {Object.entries(tagSet).map(([id, tagName]) => (
                  <TagBtn
                    key={id}
                    id={id}
                    name={tagName}
                    condition={tagSelectList.some((tag) => tag == id) ? 1 : 0}
                    action={tagBtnHandle}
                  />
                ))}
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
              autoSynching();
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
              autoSynching();
              setAddTagDialogOpen(false);
            }}
            cancel={() => {
              setAddTagDialogOpen(false);
            }}
          />
        )}

        {/* 编辑组合标签弹窗 */}
        {editTagViewDialog.isOpen && (
          <EditComboTagDialog
            id={editTagViewDialog.id}
            name={comboTagSet[editTagViewDialog.id].map((tagId) => tagSet[tagId]).join(':')}
            isOpen={editTagViewDialog.isOpen}
            ok={() => {
              setEditTagViewDialog({ isOpen: false, id: -1 });
            }}
            cancel={() => {
              setEditTagViewDialog({ isOpen: false, id: -1 });
            }}
            del={(id) => {
              rmComboTag(id);
              autoSynching();
              setEditTagViewDialog({ isOpen: false, id: -1 });
            }}
          />
        )}
        {/* 编辑标签弹窗 */}
        {editTagDialog.isOpen && (
          <EditTagDialog
            id={editTagDialog.id}
            name={tagSet[editTagDialog.id]}
            isOpen={editTagDialog.isOpen}
            ok={(id, newName) => {
              editTag(id, newName);
              autoSynching();
              setEditTagDialog({ isOpen: false, id: '' });
            }}
            cancel={() => {
              setEditTagDialog({ isOpen: false, id: '' });
            }}
            del={(id) => {
              rmTag(id);
              autoSynching();
              setEditTagDialog({ isOpen: false, id: '' });
            }}
          />
        )}

        {/* 编辑书签弹窗 */}
        {editBookmarkItemDialog.isOpen && (
          <EditBookmarkItemDialog
            isOpen={editBookmarkItemDialog.isOpen}
            info={bookmarkItems[editBookmarkItemDialog.id]}
            ok={(id, item) => {
              editBookmarkItem(id, item);
              autoSynching();
              setEditBookmarkItemDialog({ isOpen: false, id: '' });
            }}
            cancel={() => {
              setEditBookmarkItemDialog({ isOpen: false, id: '' });
            }}
            del={(id) => {
              rmBookmarkItem(id);
              autoSynching();
              setEditBookmarkItemDialog({ isOpen: false, id: '' });
            }}
          />
        )}
      </div>
    </>
  );
};

export default Bookmark;
