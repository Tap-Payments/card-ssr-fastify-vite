export interface Assets {
  localisation: { url: string; card: { url: string } };
  theme: {
    dark: string;
    light: string;
    card: {
      dark: string;
      light: string;
    };
  };
}
