import { useEffect, useState } from "react";
import useScript from "./useScript";

function usePlayerAutoComplete(options: {
  inputSelector: string;
  onSelect?: (event: any, term: string) => void;
}) {
  const [autoCompleteLoading1, setAutoCompleteLoading1] = useState(false);
  const [autoCompleteLoading2, setAutoCompleteLoading2] = useState(false);
  useScript("/scripts/auto-complete.min.js", {
    onload: () => setAutoCompleteLoading1(true)
  });
  useScript("/scripts/autocomplete-player.js", {
    onload: () => setAutoCompleteLoading2(true)
  });
  useEffect(() => {
    if (autoCompleteLoading1 && autoCompleteLoading2) {
      window["autocompletePlayer"](options.inputSelector, {
        onSelect: function(event, term) {
          if (options.onSelect) {
            event.preventSubmit = function() {
              window["preventSubmit"](this);
            }
            options.onSelect(event, term);
          }
        }
      });
    }
  }, [autoCompleteLoading1, autoCompleteLoading2]);
}

export default usePlayerAutoComplete;