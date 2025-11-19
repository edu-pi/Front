interface ServiceDtoItem {
  type?: string;
}

export const isNotServiceDto = (item: ServiceDtoItem | null | undefined): boolean => {
  if (!item?.type) {
    return false;
  }
  return ["pop", "remove", "insert", "extend", "dict"].includes(item.type);
};

export const isNotServiceDtoType = (data: ServiceDtoItem[]): boolean => {
  return data.some((item) => isNotServiceDto(item));
};
