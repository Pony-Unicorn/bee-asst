import { FC, useState, ChangeEvent, useEffect } from 'react';
import clsx from 'clsx';

export type IProps = {
  isOpen: boolean;
  id: number;
  name: string;
  cancel: () => void;
  ok: () => void;
  del: (id: number) => void;
};

const EditTagViewDialog: FC<IProps> = ({ isOpen, id, name, cancel, ok, del }) => {
  useEffect(() => {
    console.log('EditTagViewDialog Mounted...');
  }, []);

  return (
    <div className={clsx('modal', isOpen && 'modal-open')}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">编辑标签视图</h3>
        <div className="form-control">
          <label className="input-group">
            <span>名字</span>
            <input type="text" placeholder={name} className="input input-bordered" disabled />
          </label>
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

export default EditTagViewDialog;
