import { useState } from "react";
import { storage } from "../Firebase.js";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    sell: false,
    rent: false,
    parkingSpot: false,
    furnished: false,
    offer: false,
    beds: "",
    baths: "",
    regularPrice: 10,
    discountPrice: 0,
    images: {},
  });
  const [upload, setUpload] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [imagePath, setImagePath] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : type === "file" ? files : value,
    }));
  };

  const handleImageSubmit = (e) => {
    e.preventDefault();
    setUpload(true);
    setUploadError("");
    const selectedImages = Object.values(formData.images).map((img) => img);
    if (selectedImages.length === 0) {
      setUpload(false);
      setUploadError("Please choose at least one image");
      return;
    }
    if (selectedImages.length + imagePath.length > 7) {
      setUpload(false);
      setUploadError("Max Images 6 per Listing");
      return;
    }
    const promises = selectedImages.map((img) => storeImage(img));
    Promise.all(promises)
      .then((urls) => {
        setImagePath((prev) => [...prev, ...urls]);
        setUpload(false);
      })
      .catch((err) => {
        setUploadError(err);
        setUpload(false);
      });
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (imagePath.length < 1)
      return setError("Please upload at least one image");
    if (+formData.regularPrice < +formData.discountPrice)
      return setError("Discount price must below than Regular price");
    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images: imagePath,
          regularPrice: +formData.regularPrice,
          discountPrice: +formData.discountPrice,
          sell: JSON.parse(`${formData.sell}`.toLowerCase()),
          rent: JSON.parse(`${formData.rent}`.toLowerCase()),
          parkingSpot: JSON.parse(`${formData.parkingSpot}`.toLowerCase()),
          furnished: JSON.parse(`${formData.furnished}`.toLowerCase()),
          offer: JSON.parse(`${formData.offer}`.toLowerCase()),
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorText = await res.text();
        setError(errorText);
      }
      navigate(`/listing/${data.Data.list._id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="flex flex-col items-center  mt-9 ">
      <h2 className="text-2xl font-semibold mb-4">Create a Listing</h2>
      <div className="flex flex-wrap p-4 gap-4 bg-gray-100">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 p-2 w-full border rounded-md mb-4"
            onChange={handleInputChange}
          />
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Options
            </label>
            <div className="flex space-x-4 flex-wrap">
              {!formData.rent && (
                <div>
                  <input
                    type="checkbox"
                    id="sell"
                    name="sell"
                    className="mr-2"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="sell">Sell</label>
                </div>
              )}
              {!formData.sell && (
                <div>
                  <input
                    type="checkbox"
                    id="rent"
                    name="rent"
                    className="mr-2"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="rent">Rent</label>
                </div>
              )}
              {!formData.rent && (
                <div>
                  <input
                    type="checkbox"
                    id="offer"
                    name="offer"
                    className="mr-2"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="other">Offer</label>
                </div>
              )}
              <div>
                <input
                  type="checkbox"
                  id="parkingSpot"
                  name="parkingSpot"
                  className="mr-2"
                  onChange={handleInputChange}
                />
                <label htmlFor="parkingSpot">Parking Spot</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="furnished"
                  name="furnished"
                  className="mr-2"
                  onChange={handleInputChange}
                />
                <label htmlFor="furnished">Furnished</label>
              </div>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <label
                htmlFor="beds"
                className="block text-sm font-medium text-gray-700"
              >
                Beds
              </label>
              <input
                type="text"
                id="beds"
                name="beds"
                className="mt-1 p-2 w-full border rounded-md"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="baths"
                className="block text-sm font-medium text-gray-700"
              >
                Baths
              </label>
              <input
                type="text"
                id="baths"
                name="baths"
                className="mt-1 p-2 w-full border rounded-md"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="regularPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Regular Price {formData.rent ? "($/month)" : ""}
            </label>
            <input
              type="text"
              id="regularPrice"
              name="regularPrice"
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleInputChange}
            />
          </div>
          {formData.offer && (
            <div className="mb-4">
              <label
                htmlFor="discountPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Discount Price
              </label>
              <input
                type="text"
                id="discountPrice"
                name="discountPrice"
                className="mt-1 p-2 w-full border rounded-md"
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="images"
            className="block text-sm font-medium text-gray-700"
          >
            Images
          </label>
          <p className="text-gray-500 mb-2">
            The first image will be the cover (max 6)
          </p>
          <div className="flex gap-4 mb-4">
            <input
              type="file"
              id="images"
              name="images"
              multiple
              className="mt-1 p-2  border rounded-md "
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
              onClick={handleImageSubmit}
            >
              {upload ? "Uploading...." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 font-semibold">{uploadError}</p>
          {imagePath.length > 0 && (
            <div
              className={`${
                imagePath.length > 3 ? "h-96 overflow-scroll" : ""
              }`}
            >
              {imagePath.map((path, i) => (
                <PublishListing
                  url={path}
                  key={i}
                  index={i}
                  setImagePath={setImagePath}
                />
              ))}
            </div>
          )}
          <button
            type="submit"
            onClick={handleFormSubmit}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Create Listing
          </button>
          <p className="text-red-700"> {error} </p>
        </div>
      </div>
    </form>
  );
};

const PublishListing = ({ url, index, setImagePath }) => {
  function handleDelete(number) {
    setImagePath((prev) => prev.filter((_, i) => i !== number));
  }

  return (
    <div className="flex justify-between p-3 border items-center">
      <img
        src={url}
        alt="listing image"
        className="w-20 h-20 object-contain 
    rounded-lg"
      />
      <button
        type="button"
        className="p-3 text-red-700 rounded-lg uppercase 
    hover:opacity-75"
        onClick={() => handleDelete(index)}
      >
        Delete
      </button>
    </div>
  );
};

export default CreateListingForm;
