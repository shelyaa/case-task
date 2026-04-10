"use client";

import {useState} from "react";
import {subscribe, getSubscriptions, unsubscribe} from "../api/subscriptions";

export default function Home() {
  const [email, setEmail] = useState("");
  const [repo, setRepo] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const data = await subscribe(email, repo);
      setMessage(data.message);
      setRepo("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSubscriptions = async () => {
    if (!email) return setError("Enter your email first");
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const data = await getSubscriptions(email);
      setSubscriptions(data);
      if (data.length === 0) setMessage("No subscriptions found");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (token, repo) => {
    setLoading(true);
    setError(null);
    try {
      await unsubscribe(token);
      setSubscriptions((prev) =>
        prev.filter((s) => s.unsubscribe_token !== token),
      );
      setMessage(`Unsubscribed from ${repo}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-16 px-4">
      <h1 className="text-3xl font-bold mb-2">GitHub Release Tracker</h1>
      <p className="text-gray-400 mb-10">
        Subscribe to get notified about new releases
      </p>

      <form
        onSubmit={handleSubscribe}
        className="w-full max-w-md bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Repository</label>
          <input
            type="text"
            required
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="owner/repo"
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg py-2 font-semibold transition"
        >
          {loading ? "Loading..." : "Subscribe"}
        </button>
      </form>

      {message && <p className="mt-4 text-green-400">{message}</p>}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      <button
        onClick={handleGetSubscriptions}
        disabled={loading}
        className="mt-6 text-sm text-blue-400 hover:text-blue-300 underline disabled:opacity-50"
      >
        Show my subscriptions
      </button>

      {subscriptions.length > 0 && (
        <div className="w-full max-w-md mt-6 flex flex-col gap-3">
          {subscriptions.map((s) => (
            <div
              key={s.id}
              className="bg-gray-900 rounded-xl px-4 py-3 flex justify-between items-center"
            >
              <span className="text-sm font-mono text-gray-200">{s.repo}</span>
              <button
                onClick={() => handleUnsubscribe(s.unsubscribe_token, s.repo)}
                className="text-xs text-red-400 hover:text-red-300 underline"
              >
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
