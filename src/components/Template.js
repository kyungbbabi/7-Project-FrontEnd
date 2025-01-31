import HeaderAppBar from "./header/HeaderAppBar";
import React, {useContext, useEffect, useState} from "react";
import {store} from "../store/store";
import customAxios from "../AxiosProvider";
import {Alert, Avatar, Box, Divider, Snackbar, Stack, styled, Typography} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";

const Content = styled(Typography)`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: small;
`

export default function Template({marginNum, element, lastMessage}) {
  const [state, dispatch] = useContext(store);

  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(0);
  const handleCloseSnackbar = (event, reason) => {reason !== 'clickaway' && setOpen(false)}
  const handleClickSnackbar = () => {navigate(`/chat?session=${lastMessage?.sessionId}`)}

  useEffect(() => {
    customAxios.get("/user")
      .then(res => {dispatch({type: 'User', payload: res.data});})
      .catch(err => {console.log(err.response);});
  }, []);

  useEffect(() => {
    if (lastMessageId !== lastMessage.id && location.pathname !== `/chat`) {
      setOpen(true);
      setLastMessageId(lastMessage.id);
    }
  }, [lastMessage]);

  return (
    <>
      {lastMessage.id &&
        <Snackbar
          open={open}
          onClose={handleCloseSnackbar}
          autoHideDuration={3000}
          anchorOrigin={{vertical: "bottom", horizontal: "right"}}
          style={{zIndex: 1000, cursor: "pointer"}}
          onClick={handleClickSnackbar}
        >
          <Alert severity={"info"} icon={false}>
            <Stack spacing={1} width={250}>
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Avatar sx={{width: 30, height: 30}} src={lastMessage?.sender?.image ? lastMessage.sender.image.source : ""}/>
                <Typography sx={{fontSize: '14px', fontWeight: 'bold', wordBreak: 'keep-all'}}>{lastMessage?.sender?.name}</Typography>
              </Stack>
              <Divider/>
              <Content>{lastMessage?.message}</Content>
            </Stack>
          </Alert>
        </Snackbar>
      }

      <HeaderAppBar/>

      <Box mt={marginNum}>
        {element}
      </Box>
    </>
  );
}