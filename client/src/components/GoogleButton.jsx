import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../Firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailuer } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const GoogleButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const HandleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const response = await fetch("/api/google", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      if (response.ok) {
        const signInData = await response.json();
        dispatch(signInSuccess(signInData));
        navigate("/");
      } else {
        const errorText = await response.text();
        dispatch(signInFailuer(errorText));
      }
    } catch (error) {
      console.log("Could not sign in with google", error);
    }
  };

  return (
    <button
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      onClick={HandleGoogleClick}
    >
      Continue with Google
    </button>
  );
};

export default GoogleButton;
