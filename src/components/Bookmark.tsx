import { FC, useState, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { shallow } from 'zustand/shallow';

import { useBookmarkStore } from '../store/bookmark';
import TagBtn from '@/components/TagBtn';
import ViewBtn from '@/components/ViewBtn';
import BookmarkItem from '@/components/BookmarkItem';
import AddTagDialog from '@/components/AddTagDialog';
import AddBookmarkDialog from '@/components/AddBookmarkDialog';
import EditTagViewDialog from '@/components/EditTagViewDialog';
import EditTagDialog from '@/components/EditTagDialog';
import EditBookmarkItemDialog from '@/components/EditBookmarkItemDialog';

const Bookmark: FC<{}> = () => {
  const [isEdit, setEdit] = useState(false); // false: 正常状态, true: 编辑状态

  const [tagSelectList, updateTagSelectList] = useImmer<string[]>([]); // 选中的 tag 列表

  const [addTagDialogOpen, setAddTagDialogOpen] = useState(false); // 添加标签面板的是否打开
  const [addBookmarkDialogOpen, setAddBookmarkDialogOpen] = useState(false); // 添加书签面板的是否打开

  const [editTagViewDialog, setEditTagViewDialog] = useImmer({ isOpen: false, id: -1 }); // 编辑标签视图数据
  const [editTagDialog, setEditTagDialog] = useImmer({ isOpen: false, id: '' }); // 编辑标签数据
  const [editBookmarkItemDialog, setEditBookmarkItemDialog] = useImmer({ isOpen: false, id: '' }); // 编辑标签数据

  const {
    addTag,
    rmTag,
    editTag,
    tags,
    addView,
    rmView,
    tagViews,
    bookmarkItems,
    editBookmarkItem,
    rmBookmarkItem,
    addBookmarkItem,
    saveBookmark,
    loadBookmark,
    state,
    changeState,
  } = useBookmarkStore(
    (state) => ({
      addTag: state.addTag,
      rmTag: state.rmTag,
      editTag: state.editTag,
      tags: state.tags,
      addView: state.addView,
      rmView: state.rmView,
      tagViews: state.view,
      bookmarkItems: state.items,
      addBookmarkItem: state.addItem,
      editBookmarkItem: state.editItem,
      rmBookmarkItem: state.rmItem,
      saveBookmark: state.save,
      loadBookmark: state.load,
      state: state.state,
      changeState: state.changeState,
    }),
    shallow
  );

  // 等于 tagViews.length 没有任何选中, 为下次添加做准备.其他代表在 tagViews 中的索引
  const tagViewSelectIndex = useMemo(() => {
    for (let i = 0, l = tagViews.length; i < l; i++) {
      if (
        tagSelectList.length === tagViews[i].length &&
        tagSelectList.every((tagId, tagIdIndex) => tagId === tagViews[i][tagIdIndex])
      ) {
        return i;
      }
    }
    return tagViews.length;
  }, [tagSelectList, tagViews]);

  useEffect(() => {
    loadBookmark();
  }, [loadBookmark]);

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

  const onClickViewBtn = (id: number) => {
    if (isEdit) {
      console.log('编辑>>>', id);
      setEditTagViewDialog({ isOpen: true, id });
      return;
    }
    updateTagSelectList(tagViews[id]);
  };

  return (
    <>
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
                      key={view.join(':')}
                      id={index}
                      viewName={viewName}
                      condition={tagViewSelectIndex === index ? 1 : 0}
                      action={onClickViewBtn}
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

              <button
                className="btn btn-sm"
                onClick={() => {
                  saveBookmark();
                }}
              >
                save
              </button>
            </div>

            <div className="flex flex-col h-full border-t bg-base-200">
              <div className="flex flex-wrap w-48">
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

        {/* 编辑标签视图弹窗 */}
        {editTagViewDialog.isOpen && (
          <EditTagViewDialog
            id={editTagViewDialog.id}
            name={tagViews[editTagViewDialog.id].map((tagId) => tags[tagId]).join(':')}
            isOpen={editTagViewDialog.isOpen}
            ok={() => {
              setEditTagViewDialog({ isOpen: false, id: -1 });
            }}
            cancel={() => {
              setEditTagViewDialog({ isOpen: false, id: -1 });
            }}
            del={(id) => {
              rmView(id);
              setEditTagViewDialog({ isOpen: false, id: -1 });
            }}
          />
        )}
        {/* 编辑标签弹窗 */}
        {editTagDialog.isOpen && (
          <EditTagDialog
            id={editTagDialog.id}
            name={tags[editTagDialog.id]}
            isOpen={editTagDialog.isOpen}
            ok={(id, newName) => {
              editTag(id, newName);
              setEditTagDialog({ isOpen: false, id: '' });
            }}
            cancel={() => {
              setEditTagDialog({ isOpen: false, id: '' });
            }}
            del={(id) => {
              rmTag(id);
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
              setEditBookmarkItemDialog({ isOpen: false, id: '' });
            }}
            cancel={() => {
              setEditBookmarkItemDialog({ isOpen: false, id: '' });
            }}
            del={(id) => {
              rmBookmarkItem(id);
              setEditBookmarkItemDialog({ isOpen: false, id: '' });
            }}
          />
        )}
      </div>
    </>
  );
};

export default Bookmark;
