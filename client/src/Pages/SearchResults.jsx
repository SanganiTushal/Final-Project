import { useSelector } from "react-redux";
import ListingItem from "../components/ListingItem";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";

const fetchAllListings = async () => {
  const res = await fetch("/api/search");
  if (!res.ok) throw Error("Failed getting listing");
  const data = await res.json();
  return data;
};

const SearchResults = () => {
  const allListing = useLoaderData();
  const { searchListing } = useSelector((state) => state.list);
  const [displayListing, setDisplayListing] = useState(
    searchListing.length > 0 ? searchListing : allListing
  );
  const [formData, setFormData] = useState({
    searchTerm: "",
    sell: false,
    rent: false,
    parkingSpot: false,
    furnished: false,
    offer: false,
    sort_order: "createdAt_desc",
  });

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const searchTerm = formData.searchTerm;
    const sell = formData.sell;
    const rent = formData.rent;
    const offer = formData.offer;
    const parkingSpot = formData.parkingSpot;
    const furnished = formData.furnished;
    const sorting = formData.sort_order.split("_")[0];
    const orderType = formData.sort_order.split("_")[1];
    try {
      const fetchURL = `/api/search?term=${searchTerm}&sell=${sell}&rent=${rent}&offer=${offer}&parkingSpot=${parkingSpot}&
    furnished=${furnished}&sort=${sorting}&order=${orderType}`;
      const res = await fetch(fetchURL);
      if (!res.ok) throw Error("Failed getting listing");
      const data = await res.json();
      setDisplayListing(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold">
                Search Term:
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Search..."
                className="border rounded-lg p-3 w-full"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold">Type:</label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleInputChange}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleInputChange}
                />
                <span>Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleInputChange}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold">Amenities:</label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parkingSpot"
                  className="w-5"
                  onChange={handleInputChange}
                />
                <span>Parking</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleInputChange}
                />
                <span>Furnished</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Sort:</label>
              <select
                id="sort_order"
                className="border rounded-lg p-3"
                onChange={handleInputChange}
                value={formData.sort_order}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
              Search
            </button>
          </form>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold border-b p-3 text-slate-700 mt-2">
            Listing results:
          </h1>
          {displayListing.length > 0 ? (
            <div className="p-7 flex flex-wrap gap-4">
              {displayListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          ) : (
            <p>No matching listings found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export async function loader() {
  const data = await fetchAllListings();
  return data;
}

export default SearchResults;
