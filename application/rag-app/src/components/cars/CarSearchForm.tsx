"use client";

import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { buildCarSearchHref } from "@/lib/carSearch";
import {
  CAR_SEARCH_DRAFT_STORAGE_KEY,
  type CarSearchState,
  carSearchStateSchema,
  EMPTY_CAR_SEARCH_STATE,
} from "@/lib/carSearchState";
import type { LocationDTO } from "@/types/location";

import type { CarSearchLabels } from "./CarSearchForm.types";
import CriteriaSearchFields from "./CriteriaSearchFields";
import FreeTextSearchFields from "./FreeTextSearchFields";

type CarSearchFormProps = {
  labels: CarSearchLabels;
  locations: LocationDTO[];
};

export default function CarSearchForm({
  labels,
  locations,
}: CarSearchFormProps) {
  const router = useRouter();
  const [searchState, setSearchState] = useState(EMPTY_CAR_SEARCH_STATE);
  const [hasRestoredSearchState, setHasRestoredSearchState] = useState(false);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(CAR_SEARCH_DRAFT_STORAGE_KEY);
      if (storedValue) {
        const parsed = carSearchStateSchema.safeParse(JSON.parse(storedValue));
        if (parsed.success) setSearchState(parsed.data);
      }
    } catch {}

    setHasRestoredSearchState(true);
  }, []);

  useEffect(() => {
    if (!hasRestoredSearchState) return;

    try {
      localStorage.setItem(
        CAR_SEARCH_DRAFT_STORAGE_KEY,
        JSON.stringify(searchState),
      );
    } catch {}
  }, [hasRestoredSearchState, searchState]);

  const updateSearchState = (values: Partial<CarSearchState>) => {
    setSearchState((current) => ({ ...current, ...values }));
  };

  const submitSearch = (searchType: CarSearchState["searchType"]) => {
    const nextState = { ...searchState, searchType };
    try {
      localStorage.setItem(
        CAR_SEARCH_DRAFT_STORAGE_KEY,
        JSON.stringify(nextState),
      );
    } catch {}

    const submittedState =
      searchType === "freeText"
        ? {
            ...nextState,
            pickUpLocationId: "",
            returnLocationId: "",
            pickupAt: "",
            returnAt: "",
          }
        : { ...nextState, query: "" };
    router.push(buildCarSearchHref(submittedState));
  };

  return (
    <Stack spacing={{ xs: 2, sm: 2.5 }}>
      <FreeTextSearchFields
        labels={labels}
        query={searchState.query}
        onQueryChange={(query) => updateSearchState({ query })}
        onSearch={() => submitSearch("freeText")}
      />
      <CriteriaSearchFields
        labels={labels}
        locations={locations}
        searchState={searchState}
        updateSearchState={updateSearchState}
        onSearch={() => submitSearch("criteria")}
      />
    </Stack>
  );
}
