import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import depthClone from 'ramda/src/clone';
import axios from 'axios';

import apiRouteMap from '@/constants/apiRouteMap';
import { genUUID } from '@/utils/common';

// import JSZip from 'jszip';

export type ItemPrimaryKey = string; // 只包含数字的字符串，例如 12、232、1

export interface IBookmarkItem {
  i: ItemPrimaryKey;
  n: string; // 名字
  u: string; // url
  t: ItemPrimaryKey[]; // 标签 ["1","3","7"]
  ut: number; // 更新时间，秒
  ct: number; // 创建时间，秒
}

export type MustBookmarkItem = Pick<IBookmarkItem, 'n' | 'u' | 't'>;

export type ComboTag = { isPub: boolean; tags: ItemPrimaryKey[] };

export interface IExtraState {
  state: 'empty' | 'loading' | 'success' | 'fail';
  lastReadTime: number; // 最后一次读取的时间，单位为妙
}

export interface IBookmarkStorageState {
  metadata: { version: string; inc: number; lastUpdateTime: number }; // lastUpdateTime: 单位为妙
  tagSet: Record<ItemPrimaryKey, string>; // {1:"通用",2:"媒体",3:"博客",4:"工具",5:"新闻",6:"区块链",7:"前端",8:"后端",9:"框架",10:"游戏"}
  tagSetOrder: ItemPrimaryKey[]; // 标签顺序
  comboTagSet: Record<string, ComboTag>; // 排序方式按照 id 转成数字正序 {id:{isPub: false,tags: [4,6,8,9]}}
  items: Record<ItemPrimaryKey, IBookmarkItem>;
}

export interface IBookmarkAction {
  changeState: (state: IExtraState['state']) => void;
  initData: (data: IBookmarkStorageState, extraState: Pick<IExtraState, 'lastReadTime'>) => void;
  save: () => Promise<void>;
  addTag: (newTag: string) => void;
  rmTag: (tagId: ItemPrimaryKey) => boolean;
  editTag: (tagId: ItemPrimaryKey, newTag: string) => boolean;
  addComboTag: (tagIds: ItemPrimaryKey[]) => void;
  rmComboTag: (comboTag: string) => void;
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
    comboTagSet: {},
    tagSetOrder: [],
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
        store.tagSetOrder = data.tagSetOrder;
        store.lastReadTime = extraState.lastReadTime;
      });
    },
    save: async () => {
      const store = get();
      const cloudStore = {
        metadata: depthClone(store.metadata),
        comboTagSet: depthClone(store.comboTagSet),
        items: depthClone(store.items),
        tagSet: depthClone(store.tagSet),
        tagSetOrder: depthClone(store.tagSetOrder),
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
      if (Object.values(get().comboTagSet).some((comboTag) => comboTag.tags.includes(tagId))) return false;
      if (Object.values(get().items).some((item) => item.t.includes(tagId))) return false;

      set((store) => {
        delete store.tagSet[tagId];
      });

      return true;
    },
    editTag: (tagId: ItemPrimaryKey, newTag: string) => {
      if (Object.values(get().tagSet).includes(newTag)) return false; // 禁止名字相同
      set((store) => {
        store.tagSet[tagId] = newTag;
      });
      return true;
    },
    addComboTag: (tagIds: ItemPrimaryKey[]) => {
      set((store) => {
        store.comboTagSet[genUUID()] = { isPub: false, tags: tagIds };
      });
    },
    rmComboTag: (comboTag: string) => {
      set((store) => {
        delete store.comboTagSet[comboTag];
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
