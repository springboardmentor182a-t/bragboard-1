import { useEffect, useState } from "react";
import {
  getAllShoutouts,
  createShoutout,
  updateShoutout,
  deleteShoutout,
} from "../services/shoutoutService";

export function useShoutouts() {
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getAllShoutouts();
    setShoutouts(data);
    setLoading(false);
  }

  async function addShoutout(data) {
    await createShoutout(data);
    load();
  }

  async function editShoutout(id, data) {
    await updateShoutout(id, data);
    load();
  }

  async function removeShoutout(id) {
    await deleteShoutout(id);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return { shoutouts, loading, addShoutout, editShoutout, removeShoutout };
}
