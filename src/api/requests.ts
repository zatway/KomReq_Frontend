import { requestApi } from "./http";
import type {UpdateRequestDto} from "./types/interfaces/updateRequestDto.ts";
import type { ChangeStatusDto } from './types/interfaces/changeStatusDto.ts';
import type {AssignUserDto} from "./types/interfaces/assignUserDto.ts";
import type {UploadFileDto} from "./types/interfaces/uploadFileDto.ts";
import type {RequestDto} from "./types/interfaces/requestDto.ts";
import type {RequestHistoryDto} from "./types/interfaces/requestHistoryDto.ts";
import type {RequestFilterDto} from "./types/interfaces/requestFilterDto.ts";

export const updateRequest = async (id: number, model: UpdateRequestDto) => {
    const res = await requestApi.put(`/${id}`, model);
    return res.data as { message: string };
};

export const changeStatus = async (id: number, model: ChangeStatusDto) => {
    const res = await requestApi.put(`/${id}/status`, model);
    return res.data as { message: string };
};

export const assignUser = async (id: number, model: AssignUserDto) => {
    const res = await requestApi.post(`/${id}/assign`, model);
    return res.data as { message: string };
};

export const uploadFile = async (id: number, model: UploadFileDto) => {
    const fd = new FormData();
    fd.append("file", model.file);
    if (model.description) fd.append("description", model.description);
    fd.append("isConfidential", String(!!model.isConfidential));

    const res = await requestApi.post(`/${id}/files`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data as { message: string; fileId?: number };
};

export const getRequest = async (id: number) => {
    const res = await requestApi.get(`/${id}`);
    return res.data as RequestDto;
};

export const getRequests = async (filter?: RequestFilterDto) => {
    const res = await requestApi.get("", { params: filter });
    return res.data as RequestDto[];
};

export const getRequestHistory = async (id: number) => {
    const res = await requestApi.get(`/${id}/history`);
    return res.data as RequestHistoryDto[];
};

export const deleteRequest = async (id: number) => {
    const res = await requestApi.delete(`/${id}`);
    return res.data as { message: string };
};
