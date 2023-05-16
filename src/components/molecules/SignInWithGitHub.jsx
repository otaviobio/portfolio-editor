import React from "react";
import { Button, Box, Typography } from "@mui/material";

const SignInWithGitHub = ({ onSignIn }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box p={10} boxShadow={3} bgcolor="background.paper" borderRadius={8}>
        <Typography
          variant="h5"
          align="center"
          marginBottom={5}
          sx={{ color: "#202121" }}
        >
          Please sign in to check the projects
        </Typography>
        <Button
          variant="contained"
          fullWidth
          onClick={onSignIn}
          sx={{
            color: "#b1e319",
            backgroundColor: "#202121",
            ":hover": {
              bgcolor: "#b1e319",
              color: "#202121",
            },
          }}
        >
          Sign In with GitHub
        </Button>
      </Box>
    </Box>
  );
};

export default SignInWithGitHub;
