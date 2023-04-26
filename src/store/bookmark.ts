import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import dayjs from 'dayjs';

export interface IBookmarkItem {
  i: number; // id
  n: string; // 名字
  u: string; // url
  t: number[]; // 标签 [1,3,7]
  ut: number; // 更新时间，秒
  ct: number; // 创建时间，秒
}

export type MustBookmarkItem = Pick<IBookmarkItem, 'n' | 'u' | 't'>;

export interface IIndicatorState {
  state: 'empty' | 'loading' | 'success' | 'fail';
}

export interface IBookmarkStorageState {
  metadata: { version: string; inc: number };
  tags: Record<number, string>; // {1:"通用",2:"媒体",3:"博客",4:"工具",5:"新闻",6:"区块链",7:"前端",8:"后端",9:"框架",10:"游戏"}
  view: number[][]; // [[1,2,4],[4,6,8,9]]
  items: Record<number, IBookmarkItem>; // 存储转成数组存储 IBookmarkItem[]
}

export interface IBookmarkOperateState {}

export interface IBookmarkAction {
  load: () => Promise<void>;
  save: () => Promise<void>;
  addTag: (newTag: string) => void;
  rmTag: (tagId: number) => void;
  editTag: (tagId: number, newTag: string) => void;
  addView: (tagIds: number[]) => void;
  rmView: (viewIndex: string[]) => void;
  addItem: (item: MustBookmarkItem) => void;
  rmItem: (itemId: number) => void;
  editItem: (itemId: number, newItem: MustBookmarkItem) => void;
}

type IBookmarkState = IIndicatorState & IBookmarkStorageState & IBookmarkOperateState & IBookmarkAction;

export const useBookmarkStore = create(
  immer<IBookmarkState>((set, get) => ({
    state: 'empty',
    metadata: { version: '0.0.0', inc: 0 },
    view: [],
    items: {},
    tags: {},
    load: async () => {},
    save: async () => {},
    addTag: (newTag: string) => {},
    rmTag: (tagId: number) => {},
    editTag: (tagId: number, newTag: string) => {},
    addView: (tagIds: number[]) => {},
    rmView: (viewIndex: string[]) => {},
    addItem: (item: MustBookmarkItem) => {
      const now = dayjs().unix();
      set((state) => {
        state.items[++state.metadata.inc] = {
          i: state.metadata.inc,
          n: item.n,
          u: item.u,
          t: item.t,
          ut: now,
          ct: now,
        };
      });
    },
    rmItem: (itemId: number) => {},
    editItem: (itemId: number, newItem: MustBookmarkItem) => {},
  }))
);
