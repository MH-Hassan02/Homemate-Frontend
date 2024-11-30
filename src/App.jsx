import "./App.css";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup/Signup.jsx";
import Login from "./pages/Login/Login.jsx";
import Home from "./pages/Home/Home.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import Details from "./pages/Details.jsx";
import Favorites from "./components/Favorites.jsx";
import PersonalInfo from "./pages/PersonalInfo.jsx";
import EditPost from "./pages/EditPost.jsx";
import MyPosts from "./pages/MyPosts/Myposts.jsx";
import TopRated from "./pages/TopRated/TopRated.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Explore from "./pages/Explore/Explore.jsx";
import PostsByArea from "./components/PostsByArea.jsx";

function App() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);
  return (
    <div className="mb-16 md:mb-0">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/toppicks" element={<TopRated />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/editpost/:id" element={<EditPost />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/editprofile" element={<EditProfilePage />} />
        <Route path="/post/:id" element={<Details />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/personal" element={<PersonalInfo />} />
        <Route path="/search" element={<PostsByArea />} />
      </Routes>
    </div>
  );
}

export default App;
