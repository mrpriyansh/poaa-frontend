import { cloneElement } from 'react';
import useSWR from 'swr';
import { axiosUtil } from '../services/axiosinstance';

export default function FeatureFlag({ name, children }) {
  const { data } = useSWR(`feature-flag?name=${name}`, axiosUtil.swr);
  if (!data || !data.active) return null;
  return cloneElement(children, { data });
}
