import { FC, useState, ChangeEvent, useEffect } from 'react';
import clsx from 'clsx';

const Kanban: FC<{}> = () => {
  useEffect(() => {
    console.log('Kanban Mounted...');
  }, []);

  return (
    <div className="">
      <p>this is Kanban pages</p>
    </div>
  );
};

export default Kanban;
