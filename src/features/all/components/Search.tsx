import { CircleXIcon, SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRef } from "react";
import { useRankStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { useComposition } from "@/hooks/useComposition";

export default function Search() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { search, changeSearch } = useRankStore(
    useShallow(({ search, changeSearch }) => ({
      search,
      changeSearch,
    })),
  );

  function handleSearch(searchValue: string) {
    changeSearch(searchValue);
  }

  const { value, onChange, onCompositionStart, onCompositionEnd, clear } =
    useComposition(search, handleSearch);

  const handleClearInput = () => {
    clear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <InputGroup className="w-md">
      <InputGroupInput
        type="search"
        value={value}
        onChange={onChange}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        placeholder="显示数量太少？找不到？输入名字试试看！"
        aria-label="Search"
        ref={inputRef}
      />
      {value && (
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear input"
          onClick={handleClearInput}
        >
          <CircleXIcon size={16} aria-hidden="true" />
        </button>
      )}
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}
