import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import customAxios from "../../AxiosProvider";
import {store} from "../../store/store";
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  Drawer,
  Grow,
  IconButton,
  MenuItem,
  OutlinedInput,
  Paper,
  Popper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import HeaderMenu from './HeaderMenu';
import CreateFeed from '../feedline/CreateFeed';

import SmallProfile from "../SmallProfile";

const Title = styled(Typography)`
  font-size: 22px;
  font-weight: bold;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export default React.memo(function Header (props) {
  const [state, dispatch] = useContext(store);

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(true);
  const [feedContent, setFeedContent] = useState('');
  const [feedImage, setFeedImage] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState({
    currentPage: 0, totalPages: 0, totalElements: 0, users: []
  });
  const [searchUsers, setSearchUsers] = useState([]);

  useEffect(() => {
    setAnchorEl(document.getElementById("search"));
    const lateSearch = setTimeout(function() {
      setSearchOpen(true);
      if (searchValue !== '') {
        setSearchLoading(true);
        customAxios.get(`/user?keyword=${searchValue}`)
          .then(res => {
            setSearchUsers(res.data.users);
            setSearchResult(res.data);
          })
          .catch(error => console.log(error.response))
          .finally(() => {setSearchLoading(false)});
      } else {
        setSearchOpen(false);
        setSearchUsers([]);
      }
    }, 1000);
    if (lateSearch > 0) clearTimeout(lateSearch - 1);
  }, [searchValue]);

  const getOpen = (stat) => {setOpen(stat)};
  const handleClickDrawer = () => {setOpen(!open)};
  const handleClickLogo = () => {navigate('/')};
  const handleClickMyProfile = () => {navigate(`/profile?user=${state.user.id}`)};
  const handleClickProfile = (id) => {navigate(`/profile?user=${id}`)}
  const handleChangeSearchValue = (e) => {setSearchValue(e.target.value)}
  const handleClickClear = () => {setSearchValue('')}
  const handleChangeFeedContent = (e) => {setFeedContent(e.target.value)};
  const handleAddFeedImage = (e) => {
    let newImage = [];
    for (let i = 0; i < e.target.files.length; i++) {
      newImage = newImage.concat({file: e.target.files[i], originalName: e.target.files[i].name, path: URL.createObjectURL(e.target.files[i]), description: ' '});
    }
    setFeedImage(feedImage.concat(newImage));
  };
  const handleChangeDescription = (e, num) => {
    const newDescription = feedImage.map((item, index) => index === num ? {...item, description: e.target.value} : item);
    setFeedImage(newDescription);
  };
  const handleDeleteFeedImage = (num) => {
    URL.revokeObjectURL(feedImage[num].path);
    setFeedImage(feedImage.filter((item, index) => index !== num));
  };
  const resetFeed = () => {
    setFeedContent('');
    setFeedImage([]);
  };

  return (
    <AppBar style={{userSelect: 'none', position: 'sticky', backgroundColor: '#2c92ff'}}>
      <Toolbar style={{
        display: "flex", justifyContent: "space-evenly", alignItems: "center",
      }}>

        {/* 타이틀 */}
        <Box>
          <ButtonBase onClick={handleClickLogo} sx={{borderRadius: 5, px: 1.5}}>
            <MenuBookIcon sx={{fontSize: 40}}/>&nbsp;
            <Title>모두의 일기장</Title>
          </ButtonBase>
        </Box>

        <Stack direction={"row"} alignItems={"center"}>
          {/* 검색 */}
          <Box id={"search"}>
            <OutlinedInput
              size={"small"}
              inputProps={{autoComplete: 'off'}}
              style={{
                fontSize: 12, maxWidth: 200,
                backgroundColor: "rgba(255,255,255,0.15)", color: "white", borderRadius: 30
              }}
              placeholder={"유저 검색"}
              value={searchValue}
              onChange={handleChangeSearchValue}
              startAdornment={<SearchIcon sx={{pr: 1}}/>}
              endAdornment={
                searchValue !== '' ?
                  <IconButton onClick={handleClickClear} sx={{color: "white"}}>
                    <CloseIcon/>
                  </IconButton> : ""
              }
            />
          </Box>

          {/* 사용자 프로필, 더보기 메뉴 */}
          <Tooltip title="피드 작성" placement="bottom" arrow>
            <IconButton onClick={handleClickDrawer}>
              <BorderColorIcon sx={{fontSize: 24, color: "#FCFCFC"}}/>
            </IconButton>
          </Tooltip>

          <Tooltip title="알림" placement="bottom" arrow>
            <IconButton>
              <NotificationsIcon sx={{fontSize: 24, color: "#FCFCFC"}} />
            </IconButton>
          </Tooltip>

          <Tooltip title="내 프로필" placement="bottom" arrow>
            <ButtonBase onClick={handleClickMyProfile}>
              <Avatar src={state.user.image ? state.user.image.source : ''}/>
            </ButtonBase>
          </Tooltip>

          <HeaderMenu/>

        </Stack>

        <Drawer anchor='left' open={open} onClose={handleClickDrawer}>
          <CreateFeed
            feedContent={feedContent}
            feedImage={feedImage}
            getOpen={getOpen}
            handleChangeFeedContent={handleChangeFeedContent}
            handleAddFeedImage={handleAddFeedImage}
            handleChangeDescription={handleChangeDescription}
            handleDeleteFeedImage={handleDeleteFeedImage}
            resetFeed={resetFeed}/>
        </Drawer>

        {/*검색 결과*/}
        <Popper
          open={searchOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper sx={{borderRadius: 2}}>
                <Stack spacing={1} py={1} width={200}>
                  {searchLoading ?
                    <Typography variant={"subtitle2"} px={2}>검색 중입니다..</Typography>
                    :
                    (searchUsers.length > 0 ?
                      searchUsers.map((it) => {
                        return (
                          <MenuItem key={it.id} onClick={() => handleClickProfile(it.id)}>
                            <SmallProfile
                              direction={"row"}
                              spacing={2}
                              image={it.image ? it.image.source : ''}
                              name={it.name}
                            />
                          </MenuItem>
                        );
                      })
                      :
                      <Typography variant={"subtitle2"} px={2}>검색 결과가 없습니다.</Typography>
                    )
                  }
                </Stack>
              </Paper>
            </Grow>
          )}
        </Popper>

      </Toolbar>
    </AppBar>
  );
})