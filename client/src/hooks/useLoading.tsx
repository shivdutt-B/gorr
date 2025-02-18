import { useSetRecoilState } from 'recoil';
import { loadingState } from '../states/loadingAtom';

export const useLoading = () => {
  const setLoadingState = useSetRecoilState(loadingState);

  const startLoading = () => {
    const controller = new AbortController();
    setLoadingState({ loading: true, abortController: controller });
    return controller.signal;
  };

  const stopLoading = () => {
    setLoadingState({ loading: false, abortController: null });
  };

  const cancelRequest = () => {
    setLoadingState(prevState => {
      if (prevState.abortController) {
        prevState.abortController.abort();
        return { loading: false, abortController: null };
      }
      return prevState;
    });
  };

  return { startLoading, stopLoading, cancelRequest };
};
