import { Divider, Stack } from "@mui/material";

/**
 * Stack that toggles between vertical and horizontal layouts
 * across the threshold sm-xs.
 *
 * @param {object} props
 * @returns A responsive stack
 */
export default function ResponsiveStack({ children }) {
  return (
    <>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" />}
        spacing={2}
        sx={{ display: { sm: "flex", xs: "none" }, flex: 1 }}
      >
        {children}
      </Stack>
      <Stack
        divider={<Divider />}
        spacing={2}
        sx={{ display: { sm: "none", xs: "flex" }, flex: 1 }}
      >
        {children}
      </Stack>
    </>
  );
}
