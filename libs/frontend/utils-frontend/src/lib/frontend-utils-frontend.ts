export const getPreferredColorScheme = (): 'dark' | 'light' | void => {
  if (!window.matchMedia) return;

  if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    return 'dark';

  if (window.matchMedia('(prefers-color-scheme: light)').matches)
    return 'light';
};

export const renameFile = (originalFile: File, newName: string) => new File(
  [originalFile], newName, originalFile,
);
