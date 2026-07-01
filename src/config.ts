export const API =
  import.meta.env.VITE_API_URL;
import { API } from "@/config";

fetch(`${API}/api/db`);
