import './App.css';
import Sidebar from './components/Layout/Sidebar';
import BottomNav from './components/Layout/BottomNav';
// NavBar removed
import Footer from './components/Layout/Footer';
import Player from './components/Player/Player';

import LoadingBar from 'react-top-loading-bar'
import React, { useEffect, useState, Suspense } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link
} from "react-router-dom";
import Alert from './components/common/Alert';
import ErrorBoundary from './components/common/ErrorBoundary';
import bannerLogo from './assets/banner_logo.png';

// Lazy Load Pages for Performance
const Showcase = React.lazy(() => import('./components/Showcase/Showcase'));
const Search = React.lazy(() => import('./components/Search/Search'));
const AlbumsShowcase = React.lazy(() => import('./components/Showcase/AlbumsShowcase'));
const PlaylistsShowcase = React.lazy(() => import('./components/Showcase/PlaylistsShowcase'));
const About = React.lazy(() => import('./pages/About'));
const Terms = React.lazy(() => import('./pages/Terms'));

// Component to handle redirect on refresh
function RedirectToHome() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not already on home, redirect to home
    if (location.pathname !== '/') {
      navigate('/');
    }
  }, []); // Run once on mount

  return null;
}

const MobileHeader = ({ setIsMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="md:hidden p-4 bg-black flex items-center justify-between border-b border-[#282828] sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {location.pathname !== '/' && location.pathname !== '/home' && (
          <button onClick={() => navigate(-1)} className="text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        <Link to="/">
          <img src={bannerLogo} alt="VibeBox" className="h-8 w-auto object-contain" />
        </Link>
      </div>
      <button onClick={() => setIsMobileMenuOpen(true)} className="text-white hover:text-gray-300">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

function App() {
  const [progress, setProgress] = useState(0) //progress of loading bar
  const [details, setDetails] = useState(null)
  const [alert, setAlert] = useState(null)
  const [theme, setTheme] = useState("dark")

  const [albumId, setAlbumId] = useState(null)
  const [playlistId, setPlaylistId] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Queue State
  const [queue, setQueue] = useState([])

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("")
      showAlert("Light mode has been enabled.")
    }
    else {
      setTheme("dark")
      showAlert("Dark mode has been enabled.")
      // document.documentElement.classlist.add("dark")
    }
  }

  const showAlert = (message) => {
    setAlert(message)
    setTimeout(() => {
      setAlert(null)
    }, 2000);
  }



  return (
    <Router>
      <ErrorBoundary>
        <RedirectToHome />
        <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-[#1db954] selection:text-black">
          <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Top Mobile Nav (Visible only on mobile) */}
            <MobileHeader setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <div className="flex-1 overflow-y-auto bg-[#121212] relative scrollbar-hide">
              <LoadingBar
                color='#1db954'
                progress={progress}
                height={3}
                shadow={false}
                onLoaderFinished={() => setProgress(0)}
              />
              <Alert message={alert} theme="dark" />

              <div className="p-4 md:p-8 pb-32"> {/* pb-32 makes room for player */}
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1db954]"></div>
                  </div>
                }>
                  <Routes>
                    <Route exact path="/" element={<Showcase setAlbumId={setAlbumId} setPlaylistId={setPlaylistId} setProgress={setProgress} theme="dark" setDetails={setDetails} setQueue={setQueue} playingSong={details} />} />
                    <Route exact path="/about" element={<About theme="dark" />} />
                    <Route exact path="/terms" element={<Terms theme="dark" />} />
                    <Route exact path="/albums" element={<AlbumsShowcase albumId={albumId} setProgress={setProgress} theme="dark" setDetails={setDetails} setQueue={setQueue} playingSong={details} />} />
                    <Route exact path="/playlists" element={<PlaylistsShowcase playlistId={playlistId} setProgress={setProgress} theme="dark" setDetails={setDetails} setQueue={setQueue} playingSong={details} />} />
                    <Route exact path="/search" element={<Search setProgress={setProgress} theme="dark" setDetails={setDetails} setAlbumId={setAlbumId} setPlaylistId={setPlaylistId} setQueue={setQueue} playingSong={details} />} />
                    {/* Redirect /listen to / if accessed directly, as player is now global */}
                    <Route exact path="/listen" element={<Showcase setAlbumId={setAlbumId} setPlaylistId={setPlaylistId} setProgress={setProgress} theme="dark" setDetails={setDetails} setQueue={setQueue} playingSong={details} />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          </div>

          {/* Global Bottom Player */}
          <Player
            showAlert={showAlert}
            theme="dark"
            setProgress={setProgress}
            details={details}
            setDetails={setDetails}
            queue={queue}
            setQueue={setQueue}
          />

          {/* Mobile Bottom Navigation */}
          <BottomNav />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
