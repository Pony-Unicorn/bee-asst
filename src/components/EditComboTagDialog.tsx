import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { shallow } from 'zustand/shallow';

import { ComboTag, useBookmarkStore } from '@/store/bookmark';

export type IProps = {
  isOpen: boolean;
  id: string;
  info: ComboTag;
  cancel: () => void;
  ok: () => void;
  del: (id: string) => void;
};

const EditComboTagDialog: FC<IProps> = ({ isOpen, info, id, cancel, ok, del }) => {
  const { tagSet } = useBookmarkStore(
    (state) => ({
      tagSet: state.tagSet,
    }),
    shallow
  );

  const [isPubChecked, setIsPubChecked] = useState(info.isPub);

  const isPubCheckboxHandleChange = () => {
    setIsPubChecked(!isPubChecked);
  };

  useEffect(() => {
    console.log('EditTagViewDialog Mounted...');
  }, []);

  return (
    <div className={clsx('modal', isOpen && 'modal-open')}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">编辑标签组合</h3>
        <div className="form-control">
          <label className="input-group">
            <span>名字</span>
            <input
              type="text"
              placeholder={info.tags.map((tagId) => tagSet[tagId]).join(':')}
              className="input input-bordered"
              disabled
            />
          </label>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">是否公开</span>
              <input type="checkbox" className="toggle" onChange={isPubCheckboxHandleChange} checked={isPubChecked} />
            </label>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={() => del(id)}>
            删除
          </button>
          <button className="btn" onClick={ok}>
            确认
          </button>
          <button className="btn" onClick={cancel}>
            取消!
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditComboTagDialog;
