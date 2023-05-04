import type { FC } from 'react';
import clsx from 'clsx';

export type IProps = {
  id: string;
  name: string;
  condition: 0 | 1; // 未选中、选中
  action: (id: string) => void;
};

const TagBtn: FC<IProps> = ({ id, name, condition, action }) => {
  return (
    <div className="m-2">
      <button
        className={clsx('btn btn-primary btn-sm normal-case p-1 overflow-ellipsis', condition !== 1 && 'btn-outline')}
        onClick={() => action(id)}
      >
        {name}
      </button>
    </div>
  );
};

export default TagBtn;
