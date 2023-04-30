import type { FC } from 'react';
import clsx from 'clsx';

export type IProps = {
  id: string;
  tagName: string;
  condition: 0 | 1 | 2; // 未选中、选中、编辑 state
  action: (id: string) => void;
};

const TagBtn: FC<IProps> = ({ id, tagName, condition, action }) => {
  return (
    <div className="m-2">
      <div className={clsx('btn btn-primary btn-xs', condition !== 1 && 'btn-outline')} onClick={() => action(id)}>
        {tagName}
      </div>
    </div>
  );
};

export default TagBtn;
