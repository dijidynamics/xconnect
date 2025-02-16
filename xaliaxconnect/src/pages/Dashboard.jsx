import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaPlus, FaPaperPlane, FaHeart, FaComment, FaEye, FaShare } from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

function Dashboard() {
    const [tabIndex, setTabIndex] = useState(0);
    const [user, setUser] = useState(null);
    const { email } = useParams();
    const [posts, setPosts] = useState([]);
    const [image, setImage] = useState(null);
    const [newPost, setNewPost] = useState(""); // ✅ Removed duplicate state

    const navigate = useNavigate();

    // ✅ Fetch User Data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:4002/user/email/${email}`);
                if (!response.ok) throw new Error("User not found");
                const data = await response.json();
                setUser(data);
                localStorage.setItem("user", JSON.stringify(data)); // ✅ Store to localStorage
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate("/login");
            }
        };
    
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            fetchUser();
        }
    }, [email, navigate]);
    

    // ✅ Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    // ✅ Fetch Posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:4002/getpostdetails");
                if (!response.ok) throw new Error("Failed to fetch posts");
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []); // ✅ Runs only once

    // ✅ Logout Function
    const handleLogout = () => {
        setUser(null);
        navigate("/");
    };

    // ✅ Handle New Post Submission
    const handlePost = async () => {
        if (!newPost.trim()) {
            alert("Post cannot be empty!");
            return;
        }
        const postData = {
            userId: user._id,
            email: user.email,
            content: newPost,
            imageUrl: "test",
        };

        try {
            const response = await fetch("http://localhost:4002/getpostdetails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (!response.ok) throw new Error("Failed to create post");

            const data = await response.json();
            console.log("Post saved:", data);
            setNewPost("");
            setPosts([data, ...posts]); // ✅ Update UI instantly
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <div className='row'>
            <div className='col-md-3'></div>
            <div className='col-md-6 shadow rounded bg-div6 '>
                {/* Navbar */}
                <nav className="navbar navbar-light bg-light bg-gra">
                    <a className="navbar-brand" href="#">Xaliax Connect</a>
                    <div className="ml-auto d-flex align-items-center">
                        <span className="text-light me-3">Welcome, {user?.username}!</span>
                        <button className="btn btn-danger" onClick={handleLogout}>
                            <FaSignOutAlt />
                        </button>
                    </div>
                </nav>

                {/* Profile */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-color p-4 text-center">
                            <h4>Welcome, {user?.username}!</h4>
                            <p className="text-muted">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
                    <TabList className="nav nav-tabs d-flex justify-content-center">
                        <Tab className="nav-item"><button className="nav-link">Posts</button></Tab>
                        <Tab className="nav-item"><button className="nav-link">Media</button></Tab>
                        <Tab className="nav-item"><button className="nav-link">Following</button></Tab>
                        <Tab className="nav-item"><button className="nav-link">Private</button></Tab>
                    </TabList>

                    {/* Posts Tab */}
                    <TabPanel>
                        <div className="p-3 border">
                            <div className="border p-3 rounded mb-3">
                                <textarea
                                    className="form-control"
                                    placeholder="What's happening?"
                                    rows="3"
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                ></textarea>
                                <div className="d-flex align-items-center justify-content-between mt-2">
                                    <label className="btn btn-light btn-sm">
                                        <FaPlus /> <input type="file" hidden />
                                    </label>
                                    <button className="btn btn-primary btn-sm" onClick={handlePost}>
                                        <FaPaperPlane /> Post
                                    </button>
                                </div>
                            </div>

                            {/* Display Posts */}
                            {posts.length === 0 ? (
                                <p className="text-center">No posts yet.</p>
                            ) : (
                                posts.map((post) => (
                                    <div key={post._id} className="card mb-3 p-3">
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src="../src/assets/profile.jpg" 
                                                alt="User" className="rounded-circle me-2" 
                                                style={{ width: "40px", height: "40px" }}
                                            />
                                            <div>
                                                <h6 className="mb-0">{post.email}</h6>
                                                <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                                            </div>
                                        </div>
                                        <p className="mt-2">{post.content}</p>
                                        <div className="d-flex justify-content-between mt-3">
                                            <button className="btn btn-light"><FaHeart /> Like</button>
                                            <button className="btn btn-light"><FaComment /> Comment</button>
                                            <button className="btn btn-light"><FaShare /> Share</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
            <div className='col-md-3'></div>
        </div>
    );
}

export default Dashboard;
