import {Avatar, Stack, Typography} from "@mui/material";

export default function SmallProfile(props) {
  return (
    <Stack alignItems='center' direction={props.direction} spacing={props.spacing}>
      <Avatar src={props.image ?? ''}/>
      <Typography sx={{fontSize: '14px', wordBreak: 'keep-all'}}>{props.name}</Typography>
    </Stack>
  );
}