"use client"; // Add this if you're using React Server Components
import React, { useEffect, useState } from "react";

const MapWithAutocomplete: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load the Google Maps Extended Component Library script
    const loadScript = (url: string, onLoad: () => void) => {
      const script = document.createElement("script");
      script.src = url;
      script.type = "module";
      script.onload = onLoad;
      document.head.appendChild(script);
    };

    // Initialize the map and place picker
    const initMap = async () => {
      await customElements.whenDefined("gmp-map");
      setIsLoaded(true);

      const map = document.querySelector("gmp-map") as HTMLElement;
      const marker = document.querySelector(
        "gmp-advanced-marker"
      ) as HTMLElement;
      const placePicker = document.querySelector(
        "gmpx-place-picker"
      ) as HTMLElement;
      const infowindow = new google.maps.InfoWindow();

      map.innerMap.setOptions({
        mapTypeControl: false,
      });

      placePicker.addEventListener("gmpx-placechange", () => {
        const place = placePicker.value;

        if (!place.location) {
          window.alert("No details available for input: '" + place.name + "'");
          infowindow.close();
          marker.position = null;
          return;
        }

        if (place.viewport) {
          map.innerMap.fitBounds(place.viewport);
        } else {
          map.center = place.location;
          map.zoom = 17;
        }

        marker.position = place.location;
        infowindow.setContent(
          `<strong>${place.displayName}</strong><br>
           <span>${place.formattedAddress}</span>`
        );
        infowindow.open(map.innerMap, marker);
      });
    };

    loadScript(
      "https://unpkg.com/@googlemaps/extended-component-library@0.6",
      initMap
    );

    return () => {
      // Clean up the script
      const script = document.querySelector(
        'script[src="https://unpkg.com/@googlemaps/extended-component-library@0.6"]'
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="map-container" style={{ height: "100vh", width: "100%" }}>
      {isLoaded ? (
        <>
          <gmp-map
            center="40.749933,-73.98633"
            zoom="13"
            map-id="DEMO_MAP_ID"
            style={{ height: "100%", width: "100%" }}
          >
            <div
              slot="control-block-start-inline-start"
              className="place-picker-container"
            >
              <gmpx-place-picker placeholder="Enter an address"></gmpx-place-picker>
            </div>
            <gmp-advanced-marker></gmp-advanced-marker>
          </gmp-map>
        </>
      ) : (
        <p>Loading Google Maps...</p>
      )}
    </div>
  );
};

export default MapWithAutocomplete;
