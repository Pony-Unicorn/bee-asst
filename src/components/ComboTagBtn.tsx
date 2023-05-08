import type { FC } from 'react';
import clsx from 'clsx';

import TagBtn from '@/components/TagBtn';

export type IProps = {
  id: string;
  comboTagName: string;
  condition: 0 | 1; // 未选中、选中
  action: (id: string) => void;
};

const ComboTagBtn: FC<IProps> = ({ id, comboTagName, condition, action }) => {
  return (
    <TagBtn
      id={String(id)}
      name={comboTagName}
      condition={condition}
      action={(id) => {
        action(id);
      }}
    />
  );
  return (
    <div className="m-2">
      <div className={clsx('btn btn-primary btn-xs', condition !== 1 && 'btn-outline')} onClick={() => action(id)}>
        {comboTagName}
      </div>
    </div>
  );
};

export default ComboTagBtn;
