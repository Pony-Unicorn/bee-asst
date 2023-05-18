import type { FC } from 'react';
import clsx from 'clsx';

export type IProps = {
  id: string;
  comboTagName: string;
  condition: 0 | 1; // 未选中、选中
  action: (id: string) => void;
};

const ComboTagBtn: FC<IProps> = ({ id, comboTagName, condition, action }) => {
  return (
    <div className="m-1">
      <button
        className={clsx('btn btn-primary btn-sm normal-case p-0.5 truncate', condition !== 1 && 'btn-outline')}
        onClick={() => action(id)}
      >
        {comboTagName}
      </button>
    </div>
  );
};

export default ComboTagBtn;
