import fs from "fs";
import Head from "next/head";
import { useEffect, useState } from "react";
import figlet from "figlet";
import {
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Typography,
  Input,
  Button,
  TextField,
  FormControl,
  InputLabel,
  NativeSelect,
  Snackbar,
  Alert,
  Stack,
  CssBaseline,
} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

async function figletAsync(text, font) {
  return new Promise((resolve, reject) => {
    figlet(text, { font }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function getStaticProps() {
  // get font list under public/fonts
  const fonts = fs.readdirSync(`${process.cwd()}/public/fonts`);
  // remote non font files
  const fontList = fonts.filter((font) => font.endsWith(".flf"));
  // remote ".flf" extension
  const fontNames = fontList.map((font) => font.replace(".flf", ""));
  return {
    props: {
      fontNames,
    },
  };
}

export default function Home(props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const defaultFont = props.fontNames.indexOf("Standard")
    ? "Standard"
    : props.fontNames[0];

  const [selectedFont, setSelectedFont] = useState(defaultFont);

  useEffect(() => {
    figletAsync(input, selectedFont).then((data) => {
      setOutput(data);
    });
  }, [input, selectedFont]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          m: 2,
        }}
      >
        <Head>
          <title>figlet-next</title>
          <meta name="description" content="Generate ASCII art using figlet.js" />
          <CssBaseline />
        </Head>

        <Stack spacing={2}>
          <Typography variant="h4">figlet-next</Typography>

          <Typography variant="body1">
            Generate ASCII art using figlet.js
          </Typography>

          <FormControl>
            <InputLabel htmlFor="font-select">Select Font</InputLabel>
            <NativeSelect
              value={selectedFont}
              onChange={(event) => setSelectedFont(event.target.value)}
              input={<Input id="font-select" />}
            >
              {props.fontNames.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </NativeSelect>
          </FormControl>

          <Input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type something..."
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigator.clipboard.writeText(output);
              setOpenSnackbar(true);
            }}
          >
            Copy to Clipboard
          </Button>

          <TextField
            id="output"
            value={output}
            readOnly
            multiline
            variant="outlined"
          ></TextField>
        </Stack>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={1500}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            variant="filled"
            onClose={() => setOpenSnackbar(false)}
            severity="success"
          >
            Copied to clipboard
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
