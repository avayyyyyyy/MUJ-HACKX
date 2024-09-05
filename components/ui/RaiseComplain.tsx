"use client";
import React, { useState, useEffect, useRef } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { saveComplain } from "@/app/actions/saveComplain";
import { toast } from "sonner";
import { createDesriptionBasedOnUser } from "@/app/actions/createDesriptionBasedOnUser";
import { createActionableDescription } from "@/app/actions/createActionableDescription";
import { createTanmaykaDescription } from "@/app/actions/createTanmaykaDescription";
import { useRouter } from "next/navigation";

type FileInfo = {
  cdnUrl: string;
  name: string;
  size: number;
  originalName: string;
  mimeType: string;
  uploadDate: string;
  location: string;
};

type LocationSuggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

const RaiseComplain: React.FC = () => {
  const [image, setImage] = useState<FileInfo | null>(null);
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getLocation = async () => {
    return new Promise<GeolocationCoordinates>((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by this browser.");
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        (error) => {
          toast.error("Failed to get location. Please enable location access.");
          reject(error);
        }
      );
    });
  };

  const handleImageUpload = (state: {
    successEntries: Array<{
      cdnUrl: string;
      name: string;
      size: number;
      originalName: string;
      mimeType: string;
    }>;
  }) => {
    const { successEntries } = state;
    if (successEntries.length > 0) {
      const file = successEntries[0];
      const fileInfo: FileInfo = {
        cdnUrl: file.cdnUrl,
        name: file.name,
        size: file.size,
        originalName: file.originalName,
        mimeType: file.mimeType,
        uploadDate: new Date().toISOString(),
        location,
      };
      setImage(fileInfo);
      console.log("Uploaded Image Metadata:", fileInfo);
    }
  };

  const router = useRouter();

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleLocationChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setLocation(query);
    setShowSuggestions(true);

    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    suggestionTimeoutRef.current = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              query
            )}&format=json&limit=5`
          );
          const data: LocationSuggestion[] = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching location suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.display_name);
    setLatitude(suggestion.lat);
    setLongitude(suggestion.lon);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Uploaded Image:", image);
    console.log("Description:", description);
    console.log("Location:", location);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("Date:", date);
    console.log("URL:", image?.cdnUrl);

    // Ensure the description is a string
    const createDescriptionResponse = await createDesriptionBasedOnUser(
      description
    );
    const createDescription =
      createDescriptionResponse.text || createDescriptionResponse;
    toast.success("Description created successfully");

    console.log("Create Description:", createDescription);

    const tanmaykaDescription = await createTanmaykaDescription(image?.cdnUrl);
    toast.success("Tanmayka Description created successfully");

    console.log("Tanmayka Description:", tanmaykaDescription);

    const actionableResponse = await createActionableDescription(
      tanmaykaDescription.text!
    );
    toast.success("Actionable Response created successfully");

    console.log(
      "Actionable Response:",
      actionableResponse.choices[0]?.message?.content
    );

    const report =
      actionableResponse.choices[0]?.message?.content || actionableResponse;

    // Saving the complaint
    const isSaved = await saveComplain({
      description: description,
      proof: image?.cdnUrl,
      imageDate: date,
      report: report,
      location,
      latitude,
      longitude,
    });

    if (isSaved) {
      toast.success("Complaint raised successfully");
    } else {
      toast.error("Failed to raise complaint");
    }

    router.refresh(); // Refresh the page to re-fetch data
  };

  useEffect(() => {
    const requestGeolocation = async () => {
      try {
        const coords = await getLocation();
        setLatitude(coords.latitude.toString());
        setLongitude(coords.longitude.toString());
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    requestGeolocation();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSuggestions &&
        !(event.target as HTMLElement).closest(".location-autocomplete")
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  return (
    <div className="p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={"min-h-80 min-w-72 bg-zinc-900 border border-zinc-500"}
            variant="default"
          >
            Raise a Complaint
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-zinc-900 border border-zinc-800">
          <DialogHeader>
            <DialogTitle>Raise a Complaint</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Upload Image
              </label>
              <FileUploaderRegular
                sourceList="local, camera"
                classNameUploader="uc-dark"
                pubkey="8a5d63c103e8f05654bf"
                onChange={handleImageUpload}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Description
              </label>
              <Textarea
                placeholder="Enter description"
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>

            <div className="mb-4 relative location-autocomplete">
              <label className="block mb-2 text-sm font-medium">Location</label>
              <Input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={handleLocationChange}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map(
                    (suggestion: LocationSuggestion, index: number) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-zinc-800 bg-black text-white cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.display_name}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Date</label>
              <Input type="date" value={date} onChange={handleDateChange} />
            </div>

            <DialogFooter>
              <Button type="submit" variant="default">
                Submit Complaint
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RaiseComplain;
