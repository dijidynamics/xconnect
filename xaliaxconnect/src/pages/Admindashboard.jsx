import React, { useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Alert from 'react-bootstrap/Alert';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Admindashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user || {}); // Store user data
  const [image, setImage] = useState(null);
  const [postimage, setPostimage] = useState(null);
  const [preview, setPreview] = useState(user.profileImage || "http://147.93.96.202:4002/uploads/profile.jpg");
  const [postimagepreview, setPostimagepreview] = useState(user.profileImage);
  const [username, setUsername] = useState(user.username || "");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [show, setShow] = useState(false);
  const [filename, setFilename] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [postcontent, setPostcontent] = useState("");
  const [posts, setPosts] = useState([]);  // ✅ Store fetched posts
  const [userData, setUserData] = useState({}); // Store user details
  const [userDetails, setUserDetails] = useState({}); // Store user details based on email

  const [xaliaxuserDetails, setXaliaxuserDetails] = useState({});
  const [postsa, setPostsa] = useState([]); // Holds the list of posts


  useEffect(() => {
    axios.get("http://147.93.96.202:4002/userlist")
        .then(response => {
            const userMap = response.data.reduce((acc, user) => {
                acc[user.email] = user; // Map by email for quick lookup
                return acc;
            }, {});
            setXaliaxuserDetails(userMap);
        })
        .catch(error => console.error("Error fetching users:", error));
}, []);


  useEffect(() => {
    if (user.email) { // Ensure email exists before making the request
      axios.get(`http://147.93.96.202:4002/user/${user.email}`)
        .then((response) => {
          if (response.data.success) {
            setUserData(response.data.user);
            setUser(response.data.user);
            setPreview(response.data.user.profileImage);
          }
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [user.email]); // Depend on user.email to prevent unnecessary re-renders


  const fetchPostsa = async () => {
    try {
        const response = await axios.get("http://147.93.96.202:4002/postscontent");
        if (response.data.success) {
            setPosts(response.data.posts);
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

useEffect(() => {
    fetchPostsa(); // Load posts when the component mounts
}, []);



  useEffect(() => {
      axios.get("http://147.93.96.202:4002/getpostdetails") 
          .then((response) => {
              if (response.data.success) {
                  const userMap = {}; 
                  response.data.users.forEach((user) => {
                      userMap[user.email] = user; 
                  });
                  setUserDetails(userMap); 
                  toast.success("User details fetched successfully!");  // ✅ Toast message
                  console.log("User Details:", userMap);
              }
          })
          .catch((error) => {
              console.error("Error fetching user details:", error);
              toast.error("Error fetching user details!");  // ❌ Error toast
          });
  }, []);

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://147.93.96.202:4002/postscontent");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://147.93.96.202:4002/getpostdetails");
            console.log("Fetched Posts:", response.data);
            setPosts(response.data);
            toast.success("Posts fetched successfully!");  // ✅ Toast message
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Error fetching posts!");  // ❌ Error toast
        }
    };

    fetchPosts();
}, []); 
  
const fetchPostslist = async () => {
  try {
      const response = await axios.get("http://147.93.96.202:4002/getpostdetails");
      console.log("Fetched Posts:", response.data);
      setPosts(response.data);
      toast.success("Posts fetched successfully!");  // ✅ Toast message
  } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error fetching posts!");  // ❌ Error toast
  }
};


    const handleLogout = () => {
        navigate("/"); // Redirect to login page on logout
    };


      const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        setImage(file);
        setPreview(URL.createObjectURL(file)); // Show a preview of the image
        
      };


      const posthandleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
          alert("No file selected");
          return;
      }
      console.log("Selected File:", file); // Debugging: Check if file is selected

      setPostimage(file);
        setPostimagepreview(URL.createObjectURL(file)); // Show a preview of the image
        setFilename(file.name); // Store file name
      };

      const handleUpload = async () => {
        if (!image) {
          alert("Please select an image first!");
          return;
        }
        if (selectedFile) {
            setShowPreview(true); // Show preview only when the upload button is clicked
            // Upload logic here
          }
        const formData = new FormData();
        formData.append("image", image);
    
        try {
          const response = await fetch("http://147.93.96.202:4002/upload", {
            method: "POST",
            body: formData,
          });
    
          const data = await response.json();
          if (data.success) {
            const newImagePath = `http://147.93.96.202:4002/uploads/${data.filename}`;
        
            // Update user profile with the new image
            await updateUserProfile(newImagePath);
            alert("Image uploaded successfully!");

            //update user




          } else {
            alert("Upload failed");
          }
        } catch (error) {
          console.error("Upload error:", error);
        }
      };

      // Update user profile in the database
      const updateUserProfile = async (newImagePath) => {
        try {
          const response = await fetch(`http://147.93.96.202:4002/update-profile/${user.email}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, profileImage: newImagePath }),
          });
    
          const data = await response.json();
          if (data.success) {
            setUser(data.user); // Update user state
            alert("Profile updated successfully!");
          } else {
            alert("Failed to update profile");
          }
        } catch (error) {
          console.error("Profile update error:", error);
        }
      };

      //upload content
      const Uploadcontent = async () => {
        alert(`${user.email}, ${postcontent}, ${filename}`);
        console.log("Uploading content...");
        console.log("Post content:", postcontent);
        console.log("Selected Image:", image); // Debugging


        if (!postcontent.trim()) {
            alert("Post content cannot be empty!");
            return;
        }

        if (!postimage) {
          console.log("No image selected!");  // ❌ Debugging
      } else {
          console.log("Uploading file:", postimage);  // ✅ Should log file object
      }
    
        let uploadedImagePath = ""; // ✅ Declare uploadedImagePath with a default value
    
        // If an image is selected, upload it first
        if (postimage) {
          const formData = new FormData();
          formData.append("image", postimage);
      
          try {
              const response = await axios.post("http://147.93.96.202:4002/upload", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
              });
      
              console.log("Image Upload Response:", response.data); // Debugging
      
              if (response.data.success) {
                  uploadedImagePath = `http://147.93.96.202:4002/uploads/${response.data.filename}`;
               //   alert("Image uploaded successfully!");
              } else {
                  alert("Image upload failed");
                  return;
              }
          } catch (error) {
              console.error("Upload error:", error);
              alert("Error uploading image. Please try again.");
              return;
          }
      } else {
          console.log("No image selected");
      }
      
      console.log("Final Image URL:", uploadedImagePath); // Debugging

        alert(`${uploadedImagePath}`);
    
        // Now save the post content along with the image (if available)
        const postData = {
            email: user.email,
            postcontent: postcontent, // Match backend field name
            username: user.username,
            createdAt: new Date().toISOString(),
            imageUrl: uploadedImagePath, // Correctly assign uploaded image path
        };
    
        try {
            const response = await axios.post("http://147.93.96.202:4002/postscontent", postData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (response.data.success) {
                alert("Post uploaded successfully!");
                // Add the new post to the list without refreshing the page
       // Add the new post to the list without refreshing the page
                // **Update the posts list without reloading**
                fetchPostslist();
                setPostcontent("");
                setPostimage(null);
                setPostimagepreview(null); // Reset image preview
               
            } else {
                alert("Failed to upload post");
            }
        } catch (error) {
            console.error("Post upload error:", error);
        }
    };
    
    

      const handlechange =(event) => {
        setPostcontent(event.target.value)
      }



    return (
        <div>
            <div className='row'>
                <div className='col-md-3'></div>
                <div className="col-md-6">
                    {/* Navbar */}
                    <nav className="navbar navbar-light bg-lights" style={{margin: '5px', background:'#220a84 !important',   border: '1px solid #ddd',    borderradius: '5px'}}>
                        <a className="navbar-brand" href="#" style={{paddingLeft:'10px'}}> Xaliax Connect</a>
                        <div className="ml-auto d-flex align-items-center">
                            <span className="me-3" style={{color:'#fff'}}>Welcome, {user?.username || "Guest"}!</span>
                            <button className="btn " style={{ backgroundcolor: '#220a84',    border: '0px solid #fff'}} onClick={handleLogout}>
                                <FaSignOutAlt style={{color:'#fff'}} />
                            </button>
                        </div>
                    </nav>
                    <div className='bg-color'>
                    <div className="row" style={{padding:'10px'}}>
                      
                    <div className="col-md-2 col-2" style={{padding:'10px'}}>
                        <div style={{textAlign:'center',  borderRight:'2px solid #f4f4f4'}}>
                    <img 
    src={user.profileImage ? user.profileImage : "http://147.93.96.202:4002/uploads/profile.jpg"} 
    alt="Profile" 
    
    className="profileimg"
    onError={(e) => e.target.src = "http://147.93.96.202:4002/uploads/profile.jpg"} // Fallback if image fails to load
  />
                        <div>
      {showPreview  && preview && <img src={preview} alt="Preview" width="200px" />}
   {/*   <button onClick={handleUpload}>Edit</button>
      <button
              onClick={() => setShowModal(true)}
              
            >
           
            </button>*/} 
            <Button style={{backgroundColor:'#fff', borderColor:'#fff'}} onClick={handleShow}>
            <FaEdit style={{color:'#333'}} />
      </Button>
    </div>
    </div>
                        </div>
                      <div className="col-md-10 col-10">
                        <div>
                {user ? (
                  <div>
                    <p ><input style={{ border: 'none', fontWeight:'bold'}} readOnly type="text" value={username} onChange={(e) => setUsername(e.target.value)} /> <br></br><span style={{color:'#673ab7'}}>{user.email}</span></p>
                    <p><strong></strong> </p>
                     {/*  <input type="file" accept="image/*" onChange={handleImageChange} />
                    {/*   <button onClick={handleUpload}>Upload Image</button>

                 <button onClick={() => updateUserProfile(preview)}>Update Profile</button>*/} 
                  </div>
                ) : (
                  <p>No user data available</p>
                )}
            </div>
            <div>
                <div className="row">
                    <div className="col-md-3 col-3">
                        <span><span style={{fontWeight:'bold'}}>10 </span>Posts</span>
                    </div>
                    <div className="col-md-3 col-3">
                        <span><span style={{fontWeight:'bold'}}>20 </span>Media</span>
                    </div>
                    <div className="col-md-3 col-3">
                        <span><span style={{fontWeight:'bold'}}>15 </span>Following</span>
                    </div>
                    <div className="col-md-3 col-3">
                        <span><span style={{fontWeight:'bold'}}>5 </span>Private</span>
                    </div>
                </div>
            </div>

              </div>
                    </div>
                    
                </div>
                <div className="bg-color">
               
                <Tabs
      defaultActiveKey="home"
      id="justify-tab-example"
      className="mb-3"
      justify
    >
      <Tab eventKey="home" title="POSTS">
      <div style={{padding:'30px'}}>
      <div className="">
       
        {/* Profile Image */}
        <div className="row">
          <div className="col-md-2 col-4">
          <img style={{borderRadius:'10px'}}
    src={user.profileImage ? user.profileImage : "http://147.93.96.202:4002/uploads/profile.jpg"} 
    alt="Profile" 
    height="80px"  
    width="80px" 
     roundedCircle
              className="me-3 rounded"
   
    onError={(e) => e.target.src = "http://147.93.96.202:4002/uploads/profile.jpg"} // Fallback if image fails to load
 />
          </div>
          <div className="col-md-10 col-10">
            <div  style={{border:'1px solid #dee2e6', paddingLeft:'5px', paddingRight:'5px', paddingTop:'5px', paddingBottom:'10px'}}>
            <div>
          <textarea rows={4} placeholder="What's happening?" className="form-control w-100" onChange={handlechange} value={postcontent}/>
          </div>
          <div>
          {postimagepreview && <img src={postimagepreview} alt="Preview" className="preview-image" style={{ maxWidth: '100%',
    maxHeight: '360px',    objectFit: 'contain', borderRadius:'20px',   display:'block',  marginTop:'10px' }} />}
          </div>
          </div>
          <div className="d-flex justify-content-end" style={{marginTop:'10px'}}>

          <label className="btn btn-danger" 
    style={{ backgroundColor: '#f8f9fa', marginLeft:'5px', marginRight:'5px', border: '1px solid #9a9ea2', cursor: 'pointer' }}>
    <FaImage style={{color:'#333'}} />
    <input type="file" accept="image/*" onChange={posthandleImageChange} style={{ display: 'none' }} />
</label>

                       <button className="btn btn-dark" onClick={Uploadcontent}>Post</button>
   
   </div>
            </div>
        </div>
    {/* <div className="row">
            {posts.length === 0 ? (
                <p>No posts available</p> // ✅ Show if no posts
            ) : (



                posts.map((post, index) => {
                  const postUser = xaliaxuserDetails[post.email] || {}; // Find user by email

                  return (
                    <div className="col-md-12" key={index}>
                        <div className="row">
                            <div className="col-md-1">
                                <img style={{ width:'100%'}}
                              src={postUser?.profileImage || "https://via.placeholder.com/50"}   
                                    alt="User" 
                                    className="img-fluid rounded-circle"
                                />
                            </div>
                            <div className="col-md-11">
                            <strong>{postUser?.username || "Unknown User"}</strong>
                                <strong style={{    color: '#6c757d', fontWeight:'normal',fontSize:'12px'}}> | {new Date(post.createdAt).toLocaleDateString()}</strong>
                                <div className="row">
                            <div className="col-md-12">
                                <p>{post.postcontent}</p>
                            </div>
                            {post.imageUrl && (
                                <div className="col-md-12">
                                    <img 
                                        src={post.imageUrl} 
                                        alt="Post" 
                                        className="img-fluid"
                                        style={{ maxHeight: "300px", objectFit: "cover" }} 
                                    />
                                </div>
                            )}
                        </div>
                            
                            </div>
                        </div>
                     
                        <hr />
                    </div>
                         )

                          }
              
              
              )



            )}
        </div> */}
        <div className="row">
    {posts.length === 0 ? (
        <p>No posts available</p> // ✅ Show if no posts
    ) : (
        [...posts] // Create a copy of the array to avoid mutating the original
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // ✅ Sort by date (newest first)
            .map((post, index) => {
              const postUser = xaliaxuserDetails?.[post?.email] || {}; 

                return (
                    <div className="col-md-12" key={index}>
                        <div className="row">
                            <div className="col-md-1 col-3">
                                <img 
                                    style={{ width: '100%' }} 
                                    src={postUser?.profileImage || "https://via.placeholder.com/50"}   
                                    alt="User" 
                                    className="img-fluid rounded-circle"
                                />
                            </div>
                            <div className="col-md-11 col-9">
                                <strong>{postUser?.username || "Unknown User"}</strong>
                                <strong 
                                    style={{ color: '#6c757d', fontWeight: 'normal', fontSize: '12px' }}>
                                    | {new Date(post.createdAt).toLocaleDateString()}
                                </strong>
                                <div className="row">
                                    <div className="col-md-12">
                                        <p>{post.postcontent}</p>
                                    </div>
                                    {post.imageUrl && (
                                        <div className="col-md-12" style={{ textAlign:'center', backgroundColor:'#000'}}>
                                            <img 
                                                src={post.imageUrl} 
                                                alt="Post" 
                                                className="img-fluid"
                                                style={{ maxHeight: "300px", objectFit: "cover" }} 
                                            />
                                        </div>
                                    )}
                                    <div className="col-md-12">

                                      </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                );
            })
    )}
</div>


    
      </div>
     <div>
 
   </div>
     </div>
      </Tab>
      <Tab eventKey="profile" title="MY POSTS">
        Event Post
      </Tab>
      <Tab eventKey="longer-tab" title="MEDIA">
        Jobs Post
      </Tab>
      <Tab eventKey="contact" title="REELS">
        Media
      </Tab>
    </Tabs>

                </div>

                </div>
                <div className='col-md-3'></div>
            </div>

             {/* Modal Popup 
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Edit Profile Picture</h4>
            {preview && <img src={preview} alt="Preview" width="200px" />}
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload}>Update</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}*/}

<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body> <h4>Edit Profile Picture</h4>
        {preview && <img src={preview} alt="Preview" width="200px" />}
        <input type="file" accept="image/*" onChange={handleImageChange} /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
          Update
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
    );
}

export default Admindashboard;
