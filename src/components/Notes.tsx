import { FC, useEffect } from 'react';

const Notes: FC = () => {
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
