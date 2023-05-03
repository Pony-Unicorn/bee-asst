import { FC, useState, ChangeEvent, useEffect } from 'react';
import clsx from 'clsx';

export type IProps = {
  isOpen: boolean;
  id: string;
  name: string;
  cancel: () => void;
  ok: (id: string, newName: string) => void;
  del: (id: string) => void;
};

const EditTagDialog: FC<IProps> = ({ isOpen, id, name, cancel, ok, del }) => {
  const [tagNameValue, setTagNameValue] = useState(name);

  const tagNameInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    setTagNameValue(evt.target.value);
  };

  useEffect(() => {
    console.log('EditTagDialog Mounted...');
  }, []);

  return (
    <div className={clsx('modal', isOpen && 'modal-open')}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">编辑标签</h3>
        <div className="form-control">
          <label className="input-group">
            <span>标签</span>
            <input
              type="text"
              placeholder=""
              className="input input-bordered"
              value={tagNameValue}
              onChange={tagNameInputChange}
            />
          </label>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={() => del(id)}>
            删除
          </button>
          <button className="btn" onClick={() => ok(id, tagNameValue)}>
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

export default EditTagDialog;
