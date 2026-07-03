import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetSessionQuery } from "../../features/game/services/gameArena.Api";
import { useAppSelector } from "../../app/rootReducer";
import { RootState } from "../../app/store";

interface GameHeaderProps {
  title?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const { sessionId } = useAppSelector((state: RootState) => state.game);
  const { data: session } = useGetSessionQuery(sessionId || "", { skip: !sessionId });

  // Fallback rendering
  const renderBranding = () => {
    if (session?.companyLogo?.location && session?.companyName) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            sx={{
              maxHeight: "32px",
              maxWidth: "100px",
              objectFit: "contain",
            }}
            src={session.companyLogo.location}
            alt={session.companyName}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {session.companyName}
          </Typography>
        </Box>
      );
    } else if (session?.companyLogo?.location) {
      return (
        <Box
          component="img"
          sx={{
            maxHeight: "32px",
            maxWidth: "120px",
            objectFit: "contain",
          }}
          src={session.companyLogo.location}
          alt={session.companyName || "Logo"}
        />
      );
    } else {
      return (
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {title || session?.companyName || "GetSetKnow!"}
        </Typography>
      );
    }
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
