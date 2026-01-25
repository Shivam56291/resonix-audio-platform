import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import catchAsyncError from 'src/api/catchError';
import { updateNotification } from 'src/store/notification';
import client from 'src/api/client';
import { AudioData } from 'src/@types/audio';
import { getFromAsyncStorage } from 'utils/asyncStorage';
import { Keys } from 'utils/asyncStorage';

const fetchLatest = async (): Promise<AudioData[]> => {
  const { data } = await client.get('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['latest-uploads'],
    queryFn: fetchLatest,
  });

  useEffect(() => {
    if (query.error) {
      const errorMessage = catchAsyncError(query.error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    }
  }, [query.error, dispatch]);

  return query;
};

const fetchRecommended = async (): Promise<AudioData[]> => {
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
  const { data } = await client.get('/profile/recommended', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.audios;
};

export const useFetchRecommendedAudios = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['recommended'],
    queryFn: fetchRecommended,
    retry: 1,
  });

  useEffect(() => {
    if (query.error) {
      const errorMessage = catchAsyncError(query.error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    }
  }, [query.error, dispatch]);

  return query;
};
