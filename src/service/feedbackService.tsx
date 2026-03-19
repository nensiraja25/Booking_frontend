import { appAxios } from "./apiInterceptor";

export const submitFeedback = async (payload: {
  message: string;
  rating?: number | null;
  rideId?: string | null;
}) => {
  const res = await appAxios.post("/feedback", payload);
  return res.data;
};

