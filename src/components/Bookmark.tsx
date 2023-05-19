import { FC, useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useImmer } from 'use-immer';
import { shallow } from 'zustand/shallow';
import axios from 'axios';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import useKeyPressEvent from 'react-use/lib/useKeyPressEvent';

import { useBookmarkStore } from '@/store/bookmark';
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

  const [tagSelectList, updateTagSelectList] = useLocalStorage<string[]>('bee-asst-tag-select-list', []); // 选中的 tag 列表

  const [addTagDialogOpen, setAddTagDialogOpen] = useState(false); // 添加标签面板的是否打开
  const [addBookmarkDialogOpen, setAddBookmarkDialogOpen] = useState(false); // 添加书签面板的是否打开

  const [editComboTagDialog, setEditComboTagDialog] = useImmer({ isOpen: false, id: '' }); // 编辑组合标签数据
  const [editTagDialog, setEditTagDialog] = useImmer({ isOpen: false, id: '' }); // 编辑标签数据
  const [editBookmarkItemDialog, setEditBookmarkItemDialog] = useImmer({ isOpen: false, id: '' }); // 编辑书签数据

  const [isSynching, setSynching] = useState(false);

  const {
    tagSet,
    tagSetOrder,
    addTag,
    rmTag,
    editTag,
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
      tagSet: state.tagSet,
      tagSetOrder: state.tagSetOrder,
      addTag: state.addTag,
      rmTag: state.rmTag,
      editTag: state.editTag,
      comboTagSet: state.comboTagSet,
      addComboTag: state.addComboTag,
      rmComboTag: state.rmComboTag,
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

  // 返回值为 null 代表没有任何选中
  const comboTagSetSelectId = useMemo(() => {
    for (const key in comboTagSet) {
      if (
        tagSelectList!.length === comboTagSet[key].tags.length &&
        tagSelectList!.every((tagId, tagIdIndex) => tagId === comboTagSet[key].tags[tagIdIndex])
      )
        return key;
    }

    return null;
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
        initData(jsonData.data.bookmark, { lastReadTime: jsonData.data.readTime });
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

    if (tagSelectList!.includes(tagId)) {
      updateTagSelectList(tagSelectList!.filter((id) => id != tagId));
    } else {
      updateTagSelectList([...tagSelectList!, tagId].sort((a, b) => Number(a) - Number(b)));
    }
  };

  const editBtnHandle = () => {
    // updateTagSelectList([]);
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

    const url = new URL(bookmarkItems[id].u);
    url.searchParams.set('utm_source', 'bee-asst'); // utm_source=bee-asst
    window.open(url, '_blank');
  };

  const onClickComboTagBtn = (id: string) => {
    if (isEdit) {
      console.log('编辑>>>', id);
      setEditComboTagDialog({ isOpen: true, id });
      return;
    }
    updateTagSelectList(comboTagSet[id].tags);
  };

  const autoSynching = async () => {
    setSynching(true);
    try {
      await saveBookmark();
    } catch (err) {
      console.error(err);
      await loadBookmark(); // 可能数据冲突，重新获取数据
    }
    setSynching(false);
  };

  const [searchBookmarkValue, setSearchBookmarkValue] = useState('');

  // 名字和 url 参与搜索
  const searchBookmarkInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    setSearchBookmarkValue(evt.target.value);
  };

  const [lastUpEscapeTime, setLastUpEscapeTime] = useState(0); // 最后一次按下 esc 的时间戳

  //========= 快捷键绑定 =========
  useKeyPressEvent('Escape', () => {
    if (isEdit) {
      setEdit(false);
      return;
    }

    if (Date.now() - lastUpEscapeTime <= 500) {
      updateTagSelectList([]);
      return;
    }

    setLastUpEscapeTime(Date.now());
  });
  //========= 快捷键绑定 =========

  return (
    <>
      <div className="flex flex-col justify-center w-full max-w-screen-xl py-4 mx-auto">
        <div className="flex flex-grow my-1">
          {/* 标签列表 */}
          <div className="flex flex-col flex-none w-80 rounded-2xl border bg-base-300">
            <div className="flex p-1 justify-between items-center">
              <div className="flex">
                <button className="btn btn-sm" onClick={resetBtnHandle}>
                  重置
                </button>

                <button className="btn btn-sm" onClick={() => setAddTagDialogOpen(true)}>
                  新建
                </button>

                <button className={clsx('btn btn-sm', isSynching && 'loading')} onClick={autoSynching}>
                  同步
                </button>
              </div>
              <button
                className="btn btn-xs"
                onClick={() => {
                  if (tagSelectList && tagSelectList.length > 0 && addComboTag(tagSelectList!)) {
                    autoSynching();
                  } else {
                    console.log('添加失败，没有选择标签');
                  }
                }}
              >
                ➡
              </button>
              <span>组合标签</span>
            </div>

            <div className="flex flex-grow min-h-0 h-0 rounded-b-2xl border-t bg-base-200">
              <div className="flex flex-col w-48">
                <div className="flex flex-wrap overflow-y-auto">
                  {tagSetOrder.map((id) => (
                    <TagBtn
                      key={id}
                      id={id}
                      name={tagSet[id]}
                      condition={tagSelectList!.some((tag) => tag == id) ? 1 : 0}
                      action={tagBtnHandle}
                    />
                  ))}
                </div>
              </div>

              <div className="divider divider-horizontal mx-0"></div>

              <div className="flex">
                <div className="flex flex-col items-center overflow-y-auto">
                  {Object.keys(comboTagSet).map((key) => {
                    return (
                      <ComboTagBtn
                        key={key}
                        id={key}
                        comboTagName={comboTagSet[key].tags.map((tagId) => tagSet[tagId]).join(':')}
                        condition={comboTagSetSelectId === key ? 1 : 0}
                        action={onClickComboTagBtn}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 书签列表 */}
          <div className="flex flex-col flex-1 mx-2 rounded-2xl border bg-base-300">
            <div className="flex items-center p-1">
              <button className="btn btn-sm" onClick={editBtnHandle}>
                {isEdit ? '取消' : '编辑'}
              </button>

              <button
                className="btn btn-sm"
                onClick={() => {
                  setAddBookmarkDialogOpen(true);
                }}
              >
                新建
              </button>

              <input
                className="input input-bordered input-info input-sm w-full mx-2 my-1"
                type="text"
                placeholder="搜索书签"
                value={searchBookmarkValue}
                onChange={searchBookmarkInputChange}
              />
            </div>

            <div className="flex flex-grow min-h-0 h-0 rounded-b-2xl border-t bg-base-200">
              <div className="flex flex-wrap content-start overflow-y-auto overflow-x-hidden">
                {Object.values(bookmarkItems)
                  .filter((bookmarkItem) => tagSelectList!.every((tagSelectId) => bookmarkItem.t.includes(tagSelectId)))
                  .map((bookmarkItem) => (
                    <BookmarkItem key={bookmarkItem.i} item={bookmarkItem} action={onClickBookmarkItem} />
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
              if (addBookmarkItem(item)) {
                autoSynching();
                setAddBookmarkDialogOpen(false);
              }
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
              if (addTag(tagName)) {
                autoSynching();
              }
              setAddTagDialogOpen(false);
            }}
            cancel={() => {
              setAddTagDialogOpen(false);
            }}
          />
        )}

        {/* 编辑组合标签弹窗 */}
        {editComboTagDialog.isOpen && (
          <EditComboTagDialog
            id={editComboTagDialog.id}
            isOpen={editComboTagDialog.isOpen}
            info={comboTagSet[editComboTagDialog.id]}
            ok={() => {
              setEditComboTagDialog({ isOpen: false, id: '' });
            }}
            cancel={() => {
              setEditComboTagDialog({ isOpen: false, id: '' });
            }}
            del={(id) => {
              rmComboTag(id);
              autoSynching();
              setEditComboTagDialog({ isOpen: false, id: '' });
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
              if (rmTag(id)) autoSynching();
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
              if (editBookmarkItem(id, item)) {
                autoSynching();
                setEditBookmarkItemDialog({ isOpen: false, id: '' });
              }
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
