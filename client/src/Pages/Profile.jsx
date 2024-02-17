import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "../Firebase.js";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { signInSuccess, signOutAction } from "../redux/user/userSlice.js";
import { selectListing } from "../redux/list/listSlice.jsx";

const Profile = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: currentUser.password,
    avatar: currentUser.avatar,
  });
  const [listing, setListing] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return console.error("No file selected.");
      }
      let file = e.target.files[0];
      if (file && file.size <= 5 * 1024 * 1024) {
        file = e.target.files[0];
      } else {
        // Handle file size error
        return console.error("File size exceeds the limit (5 MB).");
      }
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image:", error.message);
        },
        async () => {
          // Upload complete, get download URL
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => {
            return { ...prev, avatar: imageUrl };
          });
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      setSuccessMessage(null);
      const res = await fetch("/api/update-data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        setSuccessMessage("Data updated successfully!");
      } else {
        dispatch(signOutAction());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/sign-out", {});
      if (response.ok) {
        dispatch(signOutAction());
      } else {
        console.error("Failed to sign out account:", response.statusText);
      }
    } catch (error) {
      console.error("Error Sign Out account:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        dispatch(signOutAction());
      } else {
        dispatch(signOutAction());
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const showListing = async () => {
    try {
      const res = await fetch("/api/allListing", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        dispatch(signOutAction());
      }
      const data = await res.json();
      setListing(data.Data.list);
    } catch (error) {
      console.error("Error getting data:", error);
    }
  };

  const editListing = (id) => {
    const foundListing = listing.find((list) => list._id === id);
    dispatch(selectListing(foundListing));
    navigate("/edit-listing");
  };

  const deleteListing = async (id) => {
    try {
      const res = await fetch(`/api/deleteListing/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setListing((prev) => prev.filter((list) => list._id !== id));
    } catch (error) {
      console.error("Error deleting data:", error.message);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md ">
        {/* Profile Section */}
        <div className="flex items-center mb-6">
          <label htmlFor="profileImage" className="cursor-pointer">
            <img
              src={formData.avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4"
            />
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <h2 className="text-xl font-semibold">{currentUser.username}</h2>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <progress
              className="w-full"
              value={uploadProgress}
              max="100"
            ></progress>
            <p className="text-xs text-green-500">{uploadProgress}% Complete</p>
          </div>
        )}

        {/* Form Section */}
        <form>
          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full p-2 border rounded-md"
              defaultValue={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border rounded-md"
              defaultValue={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 border rounded-md"
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              onClick={handleUpdate}
            >
              Update Now
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              onClick={function () {
                navigate("/create-listing");
              }}
            >
              Create Listing
            </button>
          </div>
        </form>
        {successMessage && (
          <p className="text-green-500 mt-2">{successMessage}</p>
        )}
        {/* Links Section */}
        <div className="mt-6">
          <button
            className="text-red-500 hover:underline"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
          <span className="mx-2">|</span>
          <button
            className="text-blue-500 hover:underline"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="max-w-md mx-auto py-6">
        <button type="button" onClick={showListing} className="block mx-auto">
          Show All Listing
        </button>
        {listing.length > 0 &&
          listing.map((list, i) => (
            <PublishListing
              data={list}
              key={i}
              deleteListing={deleteListing}
              editListing={editListing}
            />
          ))}
      </div>
    </>
  );
};

const PublishListing = ({ data, deleteListing, editListing }) => {
  return (
    <div className="flex justify-between p-3 border items-center">
      <Link to={`/listing/${data._id}`} className="flex items-center gap-4" >
        <img
          src={data.images[0]}
          alt="listing image"
          className="w-20 h-20 object-contain 
    rounded-lg"
        />
        <p>{data.name}</p>
      </Link>
      <button
        type="button"
        className="p-3 text-red-700 rounded-lg uppercase 
    hover:opacity-75"
        onClick={() => editListing(data._id)}
      >
        Edit
      </button>
      <button
        type="button"
        className="p-3 text-red-700 rounded-lg uppercase 
    hover:opacity-75"
        onClick={() => deleteListing(data._id)}
      >
        Delete
      </button>
    </div>
  );
};

export default Profile;
