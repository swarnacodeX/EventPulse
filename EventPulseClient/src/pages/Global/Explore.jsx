// src/pages/Customer/Home.jsx
import React from "react";
import Navbar from "./Navbar";
import { Box, Typography, Card, CardContent, CardCover, Button, Grid } from "@mui/joy";

const movies = [
  {
    title: "Deadpool & Wolverine",
    image: "https://in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/deadpool-and-wolverine-et00334574-1720767698.jpg"
  },
  {
    title: "Kalki 2898 AD",
    image: "https://in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kalki-2898-ad-et00304730-1719389204.jpg"
  },
  {
    title: "Inside Out 2",
    image: "https://in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/inside-out-2-et00345470-1720089302.jpg"
  },
  {
    title: "Bad Newz",
    image: "https://in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/bad-newz-et00396372-1721123460.jpg"
  }
];

export default function Explore() {
  return (
    <Box sx={{ bgcolor: "#f5f5f5" }}>
      <Navbar/>
      <Box
        sx={{
          height: 400,
          backgroundImage:
            "url(https://in.bmscdn.com/webin/common/icons/ogimage.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center"
        }}
      >
        <Typography level="h1" sx={{ fontWeight: "bold", fontSize: "3rem" }}>
          Welcome to BookMyShow Clone
        </Typography>
      </Box>

      {/* Recommended Movies */}
      <Box sx={{ px: 4, py: 4 }}>
        <Typography level="h2" sx={{ mb: 2, fontWeight: "bold" }}>
          Recommended Movies
        </Typography>
        <Grid container spacing={2}>
          {movies.map((movie, index) => (
            <Grid key={index} xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ cursor: "pointer" }}>
                <CardCover>
                  <img src={movie.image} alt={movie.title} />
                </CardCover>
                <CardContent>
                  <Typography level="h5">{movie.title}</Typography>
                  <Button variant="solid" color="primary" fullWidth sx={{ mt: 1 }}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Events Section */}
      <Box sx={{ px: 4, py: 4 }}>
        <Typography level="h2" sx={{ mb: 2, fontWeight: "bold" }}>
          Live Events
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((event, index) => (
            <Grid key={index} xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardCover>
                  <img
                    src={`https://placehold.co/400x300?text=Event+${event}`}
                    alt={`Event ${event}`}
                  />
                </CardCover>
                <CardContent>
                  <Typography level="h5">Event {event}</Typography>
                  <Button variant="soft" color="neutral" fullWidth sx={{ mt: 1 }}>
                    Know More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
