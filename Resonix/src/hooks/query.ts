import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import catchAsyncError from 'src/api/catchError';
import { updateNotification } from 'src/store/notification';
import { AudioData, History, Playlist } from 'src/@types/audio';
import { getClient } from 'src/api/client';
import { PublicProfile } from 'src/@types/user';

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

// -----------------------------------------------

const fetchUploadsByProfile = async (): Promise<AudioData[]> => {
  const client = await getClient({});
  const { data } = await client.get('/profile/uploads');
  return data.audios;
};

export const useFetchUploadsByProfile = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['uploads-by-profile'],
    queryFn: fetchUploadsByProfile,
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

// -----------------------------------------------

const fetchFavorites = async (): Promise<AudioData[]> => {
  const client = await getClient({});
  const { data } = await client.get('/favorite');
  return data.audios;
};

export const useFetchFavorite = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
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

// ------------------------------------------------

const fetchHistories = async (): Promise<History[]> => {
  const client = await getClient({});
  const { data } = await client.get('/history');
  return data.histories;
};

export const useFetchHistories = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['histories'],
    queryFn: fetchHistories,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
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

// ------------------------------------------------

const fetchRecentlyPlayed = async (): Promise<AudioData[]> => {
  const client = await getClient({});
  const { data } = await client.get('/history/recently-played');

  console.log(data);
  return data.recentlyPlayed ?? [];
};

export const useFetchRecentlyPlayed = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['recently-played'],
    queryFn: fetchRecentlyPlayed,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
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

// ------------------------------------------------

const fetchRecommendedPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient({});
  const { data } = await client.get('/profile/auto-generated-playlist');

  return data.playlist ?? [];
};

export const useFetchRecommendedPlaylist = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['recommended-playlist'],
    queryFn: fetchRecommendedPlaylist,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
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

// ------------------------------------------------

const fetchIsFavorite = async (id: string): Promise<boolean> => {
  const client = await getClient({});
  const { data } = await client.get(`/favorite/is-fav?audioId=${id}`);

  return data.result ?? false;
};

export const useFetchIsFavorite = (id: string) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['is-favorite', id],
    queryFn: () => fetchIsFavorite(id),
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    retry: 1,
    enabled: !!id,
  });

  useEffect(() => {
    if (query.error) {
      const errorMessage = catchAsyncError(query.error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    }
  }, [query.error, dispatch]);

  return query;
};


// ------------------------------------------------

const fetchPublicProfile = async (id: string): Promise<PublicProfile> => {
  const client = await getClient({});
  const { data } = await client.get(`/profile/info/${id}`);

  return data.profile ?? {};
};

export const useFetchPublicProfile = (id: string) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['profile', id],
    queryFn: () => fetchPublicProfile(id),
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    retry: 1,
    enabled: !!id,
  });

  useEffect(() => {
    if (query.error) {
      const errorMessage = catchAsyncError(query.error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    }
  }, [query.error, dispatch]);

  return query;
};


// ------------------------------------------------

const fetchPublicUploads = async (id: string): Promise<AudioData[]> => {
  const client = await getClient({});
  const { data } = await client.get(`/profile/uploads/${id}`);

  return data.audios ?? [];
};

export const useFetchPublicUploads = (id: string) => {
  const dispatch = useDispatch();

  const query = useQuery<AudioData[]>({
    queryKey: ['uploads', id],
    queryFn: () => fetchPublicUploads(id),
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    retry: 1,
    enabled: !!id,
  });

  useEffect(() => {
    if (query.error) {
      const errorMessage = catchAsyncError(query.error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    }
  }, [query.error, dispatch]);

  return query;
};

// ------------------------------------------------

const fetchPublicPlaylists = async (id: string): Promise<Playlist[]> => {
  const client = await getClient({});
  const { data } = await client.get(`/profile/playlist/${id}`);

  return data.playlists ?? [];
};

export const useFetchPublicPlaylists = (id: string) => {
  const dispatch = useDispatch();

  const query = useQuery<Playlist[]>({
    queryKey: ['playlist', id],
    queryFn: () => fetchPublicPlaylists(id),
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    retry: 1,
    enabled: !!id,
  });

  useEffect(() => {
    if (query.error) {
      const errorMessage = catchAsyncError(query.error);
      dispatch(updateNotification({ message: errorMessage, type: 'error' }));
    }
  }, [query.error, dispatch]);

  return query;
};
