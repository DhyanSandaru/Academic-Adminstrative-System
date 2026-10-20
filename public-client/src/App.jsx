import { useState } from 'react';
import Lobby from './components/Lobby.jsx';
import StudentForm from './components/StudentForm.jsx';

export default function App() {
  // token is null until the admin authorizes the student via Socket.IO
  const [token, setToken] = useState(null);

  return (
    <div className='flex justify-center items-center'>
      {token
        ? <StudentForm token={token} />
        : <Lobby onAuthorized={(t) => setToken(t)} />
      }
    </div>
  );
}
