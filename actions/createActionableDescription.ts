"use server";

export const createActionableDescription = async (description: string) => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "user",
                    content: description,
                },
            ],
        }),
    });
    
    return response.json();
}