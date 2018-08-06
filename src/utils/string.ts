// tslint:disable:no-bitwise
export const hashCode = (str: string) =>
  str
    .split("")
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0
    );
