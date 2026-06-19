import { client } from './client';
import type { Package, ApiResponse } from '@t/index';

export const listPackages = (): Promise<Package[]> =>
  client.get<ApiResponse<Package[]>>('/packages').then((r) => r.data);

export const getPackage = (id: string): Promise<Package> =>
  client.get<ApiResponse<Package>>(`/packages/${id}`).then((r) => r.data);

export const createPackage = (input: Partial<Package> & { name: string }): Promise<Package> =>
  client.post<ApiResponse<Package>>('/packages', input).then((r) => r.data);

export const updatePackage = (id: string, data: Partial<Package>): Promise<Package> =>
  client.put<ApiResponse<Package>>(`/packages/${id}`, data).then((r) => r.data);

export const deletePackage = (id: string): Promise<void> =>
  client.delete<void>(`/packages/${id}`);

export const assignPackageToUser = (userId: string, packageId: string): Promise<any> =>
  client.post<ApiResponse<any>>(`/packages/assign/${userId}`, { packageId }).then((r) => r.data);
