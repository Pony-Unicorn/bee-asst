import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import depthClone from 'ramda/src/clone';
import axios from 'axios';

import apiRouteMap from '@/constants/apiRouteMap';
// import JSZip from 'jszip';

export type ItemPrimaryKey = string; // 只包含数字的字符串，例如 12、232、1

export interface IBookmarkItem {
  i: ItemPrimaryKey;
  n: string; // 名字
  u: string; // url
  t: ItemPrimaryKey[]; // 标签 ["1","3","7"] // 存储时转换成 number [1,3,7]
  ut: number; // 更新时间，秒
  ct: number; // 创建时间，秒
}

export type MustBookmarkItem = Pick<IBookmarkItem, 'n' | 'u' | 't'>;

export interface IExtraState {
  state: 'empty' | 'loading' | 'success' | 'fail';
  lastReadTime: number; // 最后一次读取的时间，单位为妙
}

export interface IBookmarkStorageState {
  metadata: { version: string; inc: number; lastUpdateTime: number }; // lastUpdateTime: 单位为妙
  tagSet: Record<ItemPrimaryKey, string>; // {1:"通用",2:"媒体",3:"博客",4:"工具",5:"新闻",6:"区块链",7:"前端",8:"后端",9:"框架",10:"游戏"}
  comboTagSet: ItemPrimaryKey[][]; // [[1,2,4],[4,6,8,9]] crate // 存储时转换成 number, 排序方式按照 id 正序
  items: Record<ItemPrimaryKey, IBookmarkItem>; // 存储转成数组存储 IBookmarkItem[]
}

export interface IBookmarkAction {
  changeState: (state: IExtraState['state']) => void;
  initData: (data: IBookmarkStorageState, extraState: Pick<IExtraState, 'lastReadTime'>) => void;
  save: () => Promise<void>;
  addTag: (newTag: string) => void;
  rmTag: (tagId: ItemPrimaryKey) => void;
  editTag: (tagId: ItemPrimaryKey, newTag: string) => void;
  addComboTag: (tagIds: ItemPrimaryKey[]) => void;
  rmComboTag: (comboTagSetIndex: number) => void;
  addItem: (item: MustBookmarkItem) => void;
  rmItem: (itemId: ItemPrimaryKey) => void;
  editItem: (itemId: ItemPrimaryKey, newItem: MustBookmarkItem) => void;
}

type IBookmarkState = IExtraState & IBookmarkStorageState & IBookmarkAction;

export const useBookmarkStore = create(
  immer<IBookmarkState>((set, get) => ({
    state: 'empty',
    lastReadTime: 0,
    metadata: { version: '0.0.0', inc: 0, lastUpdateTime: 0 },
    comboTagSet: [],
    items: {},
    tagSet: {},
    changeState: (state: IExtraState['state']) => {
      set({ state });
    },
    initData: (data: IBookmarkStorageState, extraState: Pick<IExtraState, 'lastReadTime'>) => {
      set((store) => {
        store.metadata = data.metadata;
        store.comboTagSet = data.comboTagSet;
        store.items = data.items;
        store.tagSet = data.tagSet;
        store.lastReadTime = extraState.lastReadTime;
      });
    },
    save: async () => {
      const store = get();
      const cloudStore = {
        metadata: depthClone(store.metadata),
        comboTagSet: depthClone(store.comboTagSet.map((comboTag) => comboTag.map((tag) => Number(tag)))),
        items: depthClone(Object.values(store.items)),
        tagSet: depthClone(store.tagSet),
      };

      cloudStore.metadata.lastUpdateTime = Date.now(); // 更新写入时间

      await axios.post(
        apiRouteMap.bookmark,
        { bookmark: JSON.stringify(cloudStore), lastReadTime: store.lastReadTime },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('bee-asst-Bearer')}`,
          },
        }
      );

      set({ lastReadTime: Date.now() });
    },
    addTag: (newTag: string) => {
      if (Object.values(get().tagSet).includes(newTag)) return; // 禁止名字相同
      set((store) => {
        store.tagSet[++store.metadata.inc] = newTag;
      });
    },
    rmTag: (tagId: ItemPrimaryKey) => {
      set((store) => {
        store.comboTagSet = Array.from(
          new Set(
            store.comboTagSet
              .map((subArr) => subArr.filter((num) => num !== tagId))
              .filter((subArr) => subArr.length > 0)
              .map((v) => v.join(':'))
          )
        ).map((v) => v.split(':'));
        Object.values(store.items).forEach((item) => (item.t = item.t.filter((num) => num !== tagId)));
        delete store.tagSet[tagId];
      });
    },
    editTag: (tagId: ItemPrimaryKey, newTag: string) => {
      if (Object.values(get().tagSet).includes(newTag)) return; // 禁止名字相同
      set((store) => {
        store.tagSet[tagId] = newTag;
      });
    },
    addComboTag: (tagIds: ItemPrimaryKey[]) => {
      set((store) => {
        store.comboTagSet.push(tagIds);
      });
    },
    rmComboTag: (viewIndex: number) => {
      set((store) => {
        store.comboTagSet.splice(viewIndex, 1);
      });
    },
    addItem: (item: MustBookmarkItem) => {
      const now = Date.now();
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
          ut: Date.now(),
        };
      });
    },
  }))
);
