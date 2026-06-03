import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 500,
  duration: "5m",
};

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZWQyN2JlYTNmZDdiYTEzZDJjYWEwMCIsImlhdCI6MTc4MDQ2OTg0OX0.cn69mdjjzsMNnSkgj1JTTskxfup66-NkBfgvDefJ9gA";
const doctorId = "68eb3afbff0370d05cf1f2e4";
const userId = "68ecff462d9166d3869f45b9";

const slotTimes = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
];

export default function () {
  const slotTime = slotTimes[Math.floor(Math.random() * slotTimes.length)];

  const randomDay = Math.floor(Math.random() * 365) + 1;

  const payload = JSON.stringify({
    userId,
    docId: doctorId,
    slotDate: `${randomDay}_6_2026`,
    slotTime,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  };

  const res = http.post(
    "https://prescripto-backend-ikxu.onrender.com/api/user/book-appointment",
    payload,
    params,
  );

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}
