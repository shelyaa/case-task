const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://case-task-9kv7.onrender.com/api";

export const subscribe = async (email, repo) => {
  const res = await fetch(`${BASE_URL}/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
    },
    body: JSON.stringify({email, repo}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
};

export const getSubscriptions = async (email) => {
  const res = await fetch(
    `${BASE_URL}/subscriptions?email=${encodeURIComponent(email)}`,
    {
      headers: {"x-api-key": process.env.NEXT_PUBLIC_API_KEY},
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data.subscriptions;
};

export const unsubscribe = async (token) => {
  const res = await fetch(`${BASE_URL}/unsubscribe/${token}`, {
    headers: {"x-api-key": process.env.NEXT_PUBLIC_API_KEY},
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
};
