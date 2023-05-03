import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import dayjs from 'dayjs';
import depthClone from 'ramda/src/clone';
import axios from 'axios';
// import JSZip from 'jszip';

const bookmarkUrl = '/api-dev/bookmark';
// const bookmarkUrl = '/api/bookmark';

export type ItemPrimaryKey = string; // 只包含数字的字符串，例如 12、232、1

export interface IBookmarkItem {
  i: ItemPrimaryKey; // id // 存储时转换成 number
  n: string; // 名字
  u: string; // url
  t: ItemPrimaryKey[]; // 标签 ["1","3","7"] // 存储时转换成 number [1,3,7]
  ut: number; // 更新时间，秒
  ct: number; // 创建时间，秒
}

export type MustBookmarkItem = Pick<IBookmarkItem, 'n' | 'u' | 't'>;

export interface IIndicatorState {
  state: 'empty' | 'loading' | 'success' | 'fail';
}

export interface IBookmarkStorageState {
  metadata: { version: string; inc: number };
  tags: Record<ItemPrimaryKey, string>; // {1:"通用",2:"媒体",3:"博客",4:"工具",5:"新闻",6:"区块链",7:"前端",8:"后端",9:"框架",10:"游戏"}
  view: ItemPrimaryKey[][]; // [[1,2,4],[4,6,8,9]] crate // 存储时转换成 number, 排序方式按照 id 正序
  items: Record<ItemPrimaryKey, IBookmarkItem>; // 存储转成数组存储 IBookmarkItem[]
}

export interface IBookmarkOperateState {}

export interface IBookmarkAction {
  changeState: (state: IIndicatorState['state']) => void;
  load: () => Promise<void>;
  save: () => Promise<void>;
  addTag: (newTag: string) => void;
  rmTag: (tagId: ItemPrimaryKey) => void;
  editTag: (tagId: ItemPrimaryKey, newTag: string) => void;
  addView: (tagIds: ItemPrimaryKey[]) => void;
  rmView: (viewIndex: number) => void;
  addItem: (item: MustBookmarkItem) => void;
  rmItem: (itemId: ItemPrimaryKey) => void;
  editItem: (itemId: ItemPrimaryKey, newItem: MustBookmarkItem) => void;
}

type IBookmarkState = IIndicatorState & IBookmarkStorageState & IBookmarkOperateState & IBookmarkAction;

export const useBookmarkStore = create(
  immer<IBookmarkState>((set, get) => ({
    state: 'empty',
    metadata: { version: '0.0.0', inc: 0 },
    view: [],
    items: {},
    tags: {},
    changeState: (state: IIndicatorState['state']) => {
      set({ state });
    },
    load: async () => {
      if (get().state === 'loading') return;
      set({ state: 'loading' });
      try {
        const jsonData = await axios.get(bookmarkUrl, {
          headers: { Authorization: `Bearer ${localStorage.getItem('bee-asst-Bearer')}` },
        });
        const data = JSON.parse(jsonData.data.data);
        if (data) {
          set((store) => {
            store.metadata = data.metadata;
            store.view = data.view;
            store.items = data.items;
            store.tags = data.tags;
          });
        }
        set({ state: 'success' });
      } catch (err) {
        set({ state: 'fail' });
        console.error('load BookmarkStore fail >>>', err);
      }
    },
    save: async () => {
      const store = get();
      const cloudStore = {
        metadata: depthClone(store.metadata),
        view: depthClone(store.view),
        items: depthClone(store.items),
        tags: depthClone(store.tags),
      };

      // const zip = new JSZip();
      // zip.file('cloudStore', JSON.stringify(cloudStore));
      // const data = await zip.generateAsync({ type: 'arraybuffer' });
      // console.log(data);

      const data = JSON.stringify(cloudStore);

      await axios.post(bookmarkUrl, data, {
        headers: {
          // 'Content-Type': 'application/octet-stream',
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${localStorage.getItem('bee-asst-Bearer')}`,
        },
      });
    },
    addTag: (newTag: string) => {
      if (Object.values(get().tags).includes(newTag)) return; // 禁止名字相同
      set((store) => {
        store.tags[++store.metadata.inc] = newTag;
      });
    },
    rmTag: (tagId: ItemPrimaryKey) => {
      set((store) => {
        store.view = Array.from(
          new Set(
            store.view
              .map((subArr) => subArr.filter((num) => num !== tagId))
              .filter((subArr) => subArr.length > 0)
              .map((v) => v.join(':'))
          )
        ).map((v) => v.split(':'));
        Object.values(store.items).forEach((item) => (item.t = item.t.filter((num) => num !== tagId)));
        delete store.tags[tagId];
      });
    },
    editTag: (tagId: ItemPrimaryKey, newTag: string) => {
      if (Object.values(get().tags).includes(newTag)) return; // 禁止名字相同
      set((store) => {
        store.tags[tagId] = newTag;
      });
    },
    addView: (tagIds: ItemPrimaryKey[]) => {
      set((store) => {
        store.view.push(tagIds);
      });
    },
    rmView: (viewIndex: number) => {
      set((store) => {
        store.view.splice(viewIndex, 1);
      });
    },
    addItem: (item: MustBookmarkItem) => {
      const now = dayjs().unix();
      set((store) => {
        store.items[++store.metadata.inc] = {
          i: String(store.metadata.inc),
          n: item.n,
          u: item.u,
          t: item.t,
          ut: now,
          ct: now,
        };
      });
    },
    rmItem: (itemId: ItemPrimaryKey) => {
      set((store) => {
        delete store.items[itemId];
      });
    },
    editItem: (itemId: ItemPrimaryKey, newItem: MustBookmarkItem) => {
      set((store) => {
        store.items[itemId] = {
          ...store.items[itemId],
          n: newItem.n,
          u: newItem.u,
          t: newItem.t,
          ut: dayjs().unix(),
        };
      });
    },
  }))
);
