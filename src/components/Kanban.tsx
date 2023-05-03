import { FC, useEffect } from 'react';

const Kanban: FC = () => {
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
