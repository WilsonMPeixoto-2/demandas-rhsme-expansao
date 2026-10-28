import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const DEV_ONLY_MARKER = 'cthr-query-devtools-development-only';

export default function QueryDevtools() {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
      <span hidden aria-hidden="true" data-cthr-devtool={DEV_ONLY_MARKER} />
    </>
  );
}