import { useMutation, useQuery } from '@tanstack/react-query';
import { SpesifikasjonDto } from '../../types/dokument';
import { DokumentDto } from '../../types/dokumentDto';
import axiosInstance from '../api/axiosInstance';
import { AxiosError } from 'axios';

const keys = {
  sendTdss: ['sendTdss'],
  hentDokument: ['hentDokument'],
};

export const createTdss = async (tdss: SpesifikasjonDto) => {
  const res = await axiosInstance.post<string>('/tdss', tdss);
  return res.data;
};

export function useCreateTdss() {
  return useMutation({
    mutationFn: createTdss,
    onError: (error: AxiosError) => {
      console.error('Innsending feilet. ', error.message);
    },
  });
}

export const getDokument = async (korrelasjonsId: string | null) => {
  const res = await axiosInstance.get<DokumentDto[]>(`/${korrelasjonsId}`, {
    params: { korrelasjonsId },
  });
  return res.data;
};

export function useGetDokument(korrelasjonsId: string | null) {
  return useQuery({
    queryFn: () => getDokument(korrelasjonsId),
    queryKey: [keys.hentDokument, korrelasjonsId],
    enabled: !!korrelasjonsId,
    refetchOnWindowFocus: false,
  });
}
