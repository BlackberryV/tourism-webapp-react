import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import AuthMiddleware from "./middlewares/AuthMiddleware";
import AdminRequestsPage from "./pages/AdminRequestsPage/AdminRequestsPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import PostDetailPage from "./pages/PostDetailPage/PostDetailPage";
import PostsPage from "./pages/PostsPage/PostsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import RequestFormPage from "./pages/RequestFormPage/RequestFormPage";
import Layout from "./components/Layout";

function App() {
    return (
        <Routes>
            <Route path={'/'} element={<Layout/>}>
                <Route path="/" element={<Navigate to={"/posts"}/>}/>
                <Route path="/posts" element={<PostsPage/>}/>
                <Route path="/posts/:postId" element={<PostDetailPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/profile/:profileId" element={<ProfilePage/>}/>
                <Route path="/requests" element={<AdminRequestsPage/>}/>
                <Route path="/requestPost" element={<RequestFormPage/>}/>
                <Route path="/login" element={<AuthMiddleware><LoginPage/></AuthMiddleware>}/>
                <Route path="/signup" element={<AuthMiddleware><RegisterPage/></AuthMiddleware>}/>
            </Route>
        </Routes>
    );
}

export default App;
