// src/components/SearchBar.tsx
import { TextField, Box, InputAdornment, IconButton, SxProps, Theme, TextFieldProps } from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { useState, useEffect, useRef, FC, ReactElement } from "react";
import debounce from "lodash.debounce";

interface SearchBarProps {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
}

type SearchBarComponentProps = SearchBarProps & Omit<TextFieldProps, 'onChange' | 'value' | 'placeholder'>;

const SearchBar: FC<SearchBarComponentProps> = ({
  value = "",
  onSearch,
  placeholder,
  sx,
  ...textFieldProps
}): ReactElement => {
  const [inputValue, setInputValue] = useState<string>(value);
  const debounceRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    // انشئ الدالة المؤجلة (debounced)
    debounceRef.current = debounce((v: string) => {
      onSearch(v);
    }, 300);

    return () => {
      debounceRef.current?.cancel();
    };
  }, [onSearch]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSearch = (v: string): void => {
    setInputValue(v);
    debounceRef.current?.(v);
  };

  const clearSearch = (): void => {
    setInputValue("");
    onSearch("");
  };

  return (
    <Box sx={sx}>
      <TextField
        fullWidth
        placeholder={placeholder || "ابحث هنا..."}
        value={inputValue}
        onChange={(e) => handleSearch(e.target.value)}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="primary" fontSize="large" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                onClick={clearSearch}
                size="small"
                aria-label="مسح البحث"
                sx={{ "&:hover": { bgcolor: "action.hover" } }}
              >
                <Close fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 3,
            height: 60,
            fontSize: "1.1rem",
            "& fieldset": {
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
            "&.Mui-focused fieldset": {
              borderWidth: 2,
            },
          },
        }}
        {...textFieldProps}
      />
    </Box>
  );
};

export default SearchBar;
