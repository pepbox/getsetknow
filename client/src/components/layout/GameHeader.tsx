import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetSessionQuery } from "../../features/game/services/gameArena.Api";
import { useAppSelector } from "../../app/rootReducer";
import { RootState } from "../../app/store";

import defaultLogo from "../../assets/Get-Set-Know.webp";

interface GameHeaderProps {
  title?: string;
}

const GameHeader: React.FC<GameHeaderProps> = () => {
  const navigate = useNavigate();
  const { sessionId } = useAppSelector((state: RootState) => state.game);
  const { data: session } = useGetSessionQuery(sessionId || "", { skip: !sessionId });

  // Fallback rendering
  const renderBranding = () => {
    const logoSrc = session?.companyLogo?.location || defaultLogo;
    const name = session?.companyName || "GetSetKnow";
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          component="img"
          sx={{
            maxHeight: "32px",
            maxWidth: "100px",
            objectFit: "contain",
          }}
          src={logoSrc}
          alt={name}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {name}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        pt: 3,
        color: "black",
      }}
    >
      <IconButton onClick={() => navigate(-1)} sx={{ p: 0.5 }}>
        <ArrowBack />
      </IconButton>
      <Box sx={{ mx: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {renderBranding()}
      </Box>
    </Box>
  );
};

export default GameHeader;
