import { useEffect, useRef } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Join from "./pages/Join";
import { RecoilRoot } from "recoil";
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../src/hooks/useFetchUserData";
import { userAtom } from "./states/userAtom";
import Dashboard from "./pages/Dashboard";
import ImportRepo from "./pages/ImportRepo";
import Deploy from "./pages/Deploy";
import { useLoading } from "./hooks/useLoading";
import { Link } from "react-router-dom";
function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <AppWithUserCheck />
      </BrowserRouter>
    </RecoilRoot>
  );
}

function AppWithUserCheck() {
  const user = useRecoilValue(userAtom);
  const fetchUser = useFetchUserData();
  const { isLoading } = useLoading();
  const hasFetched = useRef(false);

  useEffect(() => {
    const initiateFetch = async () => {
      if (!hasFetched.current && !user && !isLoading) {
        hasFetched.current = true;
        try {
          await fetchUser();
        } catch (error) {
          console.error("Error during user fetch:", error);
        }
      }
    };

    initiateFetch();
  }, [fetchUser, user, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/join" element={<Join />} />
      <Route exact path="/dashboard/*" element={<Dashboard />} />
      <Route exact path="/import" element={<ImportRepo />} />
      <Route exact path="/deploy" element={<Deploy />} />
      <Route exact path="/test" element={
        <div>
          <div>TEST</div>
          <Link to="/"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              marginTop: '20px'
            }}
          >
            Back to Home
          </Link>
        </div>
      } />
    </Routes>
  );
}

export default App;
