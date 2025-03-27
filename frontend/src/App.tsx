import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {signOut, useSessionContext} from "supertokens-auth-react/recipe/session"
import {useNavigate} from "react-router";
import {useQuery} from "@tanstack/react-query";

function App() {
  const [count, setCount] = useState(0)
  const session = useSessionContext();
  const navigate = useNavigate();
  const {data} = useQuery({
      queryKey: ['queue'],
      queryFn: () => fetch('/api/print-queue', {
          headers: {
              'x-user-uuid': "test"
          }
      }).then(res => res.json()),
  })

    console.log(data);

  const logout = async () => {
    await signOut();
    navigate('/login');
  }

  return (
    <>
        {!session.loading && (
            <>
                <p>Logged in as <b>{session.userId}</b></p>
                <button onClick={logout}>Sign out</button>
            </>
        )}
        <div>
            <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
