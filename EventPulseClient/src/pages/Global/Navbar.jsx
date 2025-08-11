import React from "react";
import {
  Box,
  Typography,
  Select,
  Option,
  Input,
  Button,
  IconButton,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import  useStore  from '../../state-management/storeZustand';

export default function Navbar() {
    const {city,setCity}=useStore();
    const cities=["Bengaluru","Kolkata","Delhi","Mumbai","Pune","Chennai","Coimbatore","Hyderabad"]


  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 1.5,
        bgcolor: "background.body",
        boxShadow: "sm",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left: Logo */}
      <Typography
        level="h4"
        sx={{ fontWeight: "bold", cursor: "pointer", color: "primary.500" }}
      >
        EventPulse
      </Typography>

      {/* Middle: Location + Search */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, mx: 3 }}>
<Select
  size="sm"
  value={city}
  onChange={(event,newValue) => setCity(newValue)}
  sx={{ minWidth: 120 }}
  variant="outlined"
>
  {cities.map((c) => (
    <Option key={c} value={c}>
      {c}
    </Option>
  ))}
</Select>



        <Box sx={{ position: "relative", flexGrow: 1 }}>
          <Input
            size="sm"
            placeholder="Search for movies, events, plays, sports and activities"
            startDecorator={<SearchIcon />}
            sx={{ width: "100%" }}
          />
        </Box>
      </Box>

      {/* Right: Sign In button */}
      <Button variant="solid" color="primary" size="sm">
        Sign In
      </Button>

      {/* Mobile Menu Icon (optional) */}
      <IconButton
        variant="plain"
        color="neutral"
        sx={{ display: { xs: "inline-flex", md: "none" }, ml: 1 }}
        aria-label="open menu"
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );
}
