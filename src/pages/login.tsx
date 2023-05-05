import { ChangeEvent, FC, useState } from 'react';
import useAxios from 'axios-hooks';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

import apiRouteMap from '@/constants/apiRouteMap';

const Login: FC = () => {
  const router = useRouter();

  const [name, setName] = useState(''); //
  const [psw, setPsw] = useState(''); //

  const [{ loading, error }, execute] = useAxios(
    {
      url: apiRouteMap.login,
      method: 'POST',
    },
    { manual: true }
  );

  const tagNameInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    setName(evt.target.value);
  };

  const tagPswInputChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    setPsw(evt.target.value);
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}>
      <div className="flex flex-col items-center flex-grow container p-4">
        <div className="form-control">
          <label className="input-group">
            <span>名字</span>
            <input type="text" placeholder="" className="input input-bordered" value={name} onChange={tagNameInputChange} />
          </label>
          <label className="input-group">
            <span>密码</span>
            <input type="password" placeholder="" className="input input-bordered" value={psw} onChange={tagPswInputChange} />
          </label>
          <button
            className="btn"
            onClick={() => {
              execute({ data: { user: name, password: psw } }).then((res) => {
                localStorage.setItem('bee-asst-Bearer', res.data.data.token);
                router.replace('/');
              });
            }}
          >
            登陆
          </button>
        </div>
      </div>
    </main>
  );
};

export default Login;
