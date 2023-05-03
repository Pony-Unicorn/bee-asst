import type { FC } from 'react';
import clsx from 'clsx';

import TagBtn from '@/components/TagBtn';

export type IProps = {
  id: number;
  viewName: string;
  condition: 0 | 1; // 未选中、选中
  action: (id: number) => void;
};

const ViewBtn: FC<IProps> = ({ id, viewName, condition, action }) => {
  return (
    <TagBtn
      id={String(id)}
      name={viewName}
      condition={condition}
      action={(id) => {
        action(Number(id));
      }}
    />
  );
  return (
    <div className="m-2">
      <div className={clsx('btn btn-primary btn-xs', condition !== 1 && 'btn-outline')} onClick={() => action(id)}>
        {viewName}
      </div>
    </div>
  );
};

export default ViewBtn;
