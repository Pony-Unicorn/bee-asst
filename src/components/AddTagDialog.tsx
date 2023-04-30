import { FC, useState, ChangeEvent, useEffect } from 'react';
import clsx from 'clsx';

export type IProps = {
  isOpen: boolean;
  cancel: () => void;
  ok: (tagName: string) => void;
};

const AddTagDialog: FC<IProps> = ({ isOpen, cancel, ok }) => {
  const [tagNameValue, setTagNameValue] = useState('');

  const tagNameInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    setTagNameValue(evt.target.value);
  };

  useEffect(() => {
    console.log('AddTagDialog Mounted...');
  }, []);

  return (
    <div className={clsx('modal', isOpen && 'modal-open')}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">添加标签（tag）</h3>
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
          <button className="btn" onClick={() => ok(tagNameValue)}>
            添加
          </button>
          <button className="btn" onClick={cancel}>
            取消!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTagDialog;
