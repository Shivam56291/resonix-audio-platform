import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import catchAsyncError from 'src/api/catchError';
import { updateNotification } from 'src/store/notification';
import { AudioData, Playlist } from 'src/@types/audio';
import { getClient } from 'src/api/client';

const fetchLatest = async (): Promise<AudioData[]> => {
  const client = await getClient({});
  const { data } = await client.get('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['latest-uploads'],
    queryFn: fetchLatest,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
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
  const client = await getClient({});
  const { data } = await client.get('/profile/recommended');
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

const fetchPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient({});
  const { data } = await client.get('/playlist/by-profile');
  return data.playlist;
};

export const useFetchPlaylist = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['playlist'],
    queryFn: fetchPlaylist,
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
