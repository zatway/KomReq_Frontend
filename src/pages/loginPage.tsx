import {Button, Container, Grid, Input, Stack} from "@mui/material";

const LoginPage = () => {
    return (
        <Container>
            <Grid container spacing={2} direction='column'>
                <Grid height='*'>
                </Grid>
                <Grid height='auto'>
                    <Stack>
                        <Input></Input>
                        <Input></Input>
                        <Button></Button>
                    </Stack>
                </Grid>
                <Grid height='*'>
                </Grid>
            </Grid>
        </Container>
    );
};

export default LoginPage;
