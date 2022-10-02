import React, { useState } from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Button, Dialog, DialogContent, Grid, Stack, TextField, Typography } from '@mui/material';
import Register from './Register';
import './anchorCss.css';
import axios from 'axios';

export default function Login(props) {

  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [loginInfo, setLoginInfo] = useState({password: null, uid: null});
  const [authCode, setAuthCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [idErrorMessage, setIdErrorMessage] = useState('');
  const [pwErrorMessage, setPwErrorMessage] = useState('');
  const [codeErrorMessage, setCodeErrorMessage] = useState('');

  const loginValidate = () => {
    let valid = true;
    if (!loginInfo.uid) {
      setIdErrorMessage('아이디를 입력해 주세요.');
      valid = false;
    } else setIdErrorMessage('');
    if (!loginInfo.password) {
      setPwErrorMessage('비밀번호를 입력해 주세요.');
      valid = false;
    } else setPwErrorMessage('');
    return valid;
  };
  const codeValidate = () => {
    let valid = true;
    if (!authCode) {
      setCodeErrorMessage('인증 코드를 입력해 주세요.');
      valid = false;
    } else setCodeErrorMessage('');
    return valid;
  };

  const handleClickOpen = () => { setOpen(true) };
  const handleClickClose = () => { setOpen(false) };
  const handleAuthInfoChange = (e) => {setAuthCode(e.target.value)};
  const handleLoginInfoChange = (e) => {
    const {name, value} = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });
  };
  const handleClickLogin = async (e) => {
    e.preventDefault();
    loginValidate() &&
    await axios.post(`/auth/login`, loginInfo)
      .then(res => {
        console.log(res);
        props.getLogin(true);
      })
      .catch(error => {
        if (error.response.status === 401) {
          setErrorMessage(error.response.data.message)
        } else setErrorMessage('')
        if (error.response.status === 302) {
          setAuth(true);
        }
        console.log(error.response);
      })
  };
  const handleClickAuthLogin = async (e) => {
    e.preventDefault();
    (loginValidate() & codeValidate()) &&
    await axios.post(`/auth/mail-auth-login`, {code: authCode, ...loginInfo})
      .then(res => {
        props.getLogin(true);
        console.log(res);
      })
      .catch(error => {
        setCodeErrorMessage(error.response.data.message);
        console.log(error);
      })
  };

  return (
      <>
        <Stack sx={{
          width: 300, position: 'absolute', transform: 'translate(-50%, -50%)',
          left: '50%', top: '50%', borderRadius: '30px', padding: '60px', boxShadow: 6
        }}
               spacing={2} align='center'>
          <Grid align='center'>
            <MenuBookIcon color='primary' sx={{fontSize: 100}}/>
            <Typography variant='h4' color='primary' fontWeight='bold'>모두의 일기장</Typography>
          </Grid>

          <Box component="form">
            <Stack spacing={1}>
              <TextField label='ID' name="uid" onChange={handleLoginInfoChange}
                         helperText={idErrorMessage} error={!!idErrorMessage}
              />
              <TextField label='PW' type='password' name="password" onChange={handleLoginInfoChange}
                         helperText={pwErrorMessage} error={!!pwErrorMessage}
              />
              {auth &&
                  <>
                    <Typography variant='subtitle2' color="text.secondary" sx={{textAlign: 'start'}}>등록된 이메일로 인증코드가 발송되었습니다.</Typography>
                    <TextField label='인증코드' name="code" onChange={handleAuthInfoChange}
                               helperText={codeErrorMessage} error={!!codeErrorMessage}
                    />
                    <Box sx={{textAlign: 'end'}}>
                      <Button onClick={handleClickLogin} size='small' sx={{width: 'max-content'}}>인증코드 재전송</Button>
                    </Box>
                  </>
              }

              <Button type='submit' variant='contained' color='success' onClick={auth ? handleClickAuthLogin : handleClickLogin}>
                {auth ? '확인' : '로그인'}
              </Button>
              <Typography color='red' fontSize={12}>{errorMessage}</Typography>
            </Stack>
          </Box>

          <a href="/">아이디/비밀번호를 잊어버렸어요</a>
          <Typography variant='subtitle2' color="text.secondary">또는</Typography>
          <Button onClick={handleClickOpen} variant='contained'>회원가입</Button>
        </Stack>

        <Dialog open={open} onClose={handleClickClose} maxWidth='xs' fullWidth={true}>
          <DialogContent>
            <Register
              getLogin={props.getLogin}
              toggleLoading={props.toggleLoading}
              setName={props.setName}
              setEmail={props.setEmail}
              setId={props.setId}
            />
          </DialogContent>
        </Dialog>
      </>
  );
}
