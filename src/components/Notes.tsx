import { FC, useState, ChangeEvent, useEffect } from 'react';
import clsx from 'clsx';

const Notes: FC<{}> = () => {
  useEffect(() => {
    console.log('Notes Mounted...');
  }, []);

  return (
    <div className="">
      <p>this is Notes pages</p>
    </div>
  );
};

export default Notes;
