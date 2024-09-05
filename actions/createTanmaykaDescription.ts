"use server";

export const createTanmaykaDescription = async (imageUrl: string) => {
  const raw = JSON.stringify({
    image_url: imageUrl
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch("https://64kttv60-5000.inc1.devtunnels.ms/process-image", requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("result: ",result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};
