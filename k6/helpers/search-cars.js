import http from "k6/http";
import { CARSERVICE_URLS } from "../urls.js";

export const searches = [
  ["Düsseldorf", "2027-09-10T10:00:00Z", "2027-09-11T10:00:00Z"],
  ["Essen", "2027-09-12T10:00:00Z", "2027-09-13T10:00:00Z"],
  ["Köln", "2027-09-14T10:00:00Z", "2027-09-15T10:00:00Z"],
  ["Köln", "2027-09-10T10:00:00Z", "2027-09-12T10:00:00Z"],
  ["Düsseldorf", "2027-09-11T10:00:00Z", "2027-09-13T10:00:00Z"],
  ["Essen", "2027-09-14T10:00:00Z", "2027-09-16T10:00:00Z"],
  ["Köln", "2027-09-16T10:00:00Z", "2027-09-17T10:00:00Z"],
  ["Düsseldorf", "2027-09-18T10:00:00Z", "2027-09-20T10:00:00Z"],
  ["Essen", "2027-09-19T10:00:00Z", "2027-09-21T10:00:00Z"],
  ["Köln", "2027-09-21T10:00:00Z", "2027-09-23T10:00:00Z"],
  ["Düsseldorf", "2027-09-24T10:00:00Z", "2027-09-25T10:00:00Z"],
];

export function searchCars(search = searches[Math.floor(Math.random() * searches.length)]) {
  const [location, pickupAt, returnAt] = search;
  return http.get(
    `${CARSERVICE_URLS.carSearch}?location=${encodeURIComponent(location)}&pickupAt=${encodeURIComponent(pickupAt)}&returnAt=${encodeURIComponent(returnAt)}`,
  );
}