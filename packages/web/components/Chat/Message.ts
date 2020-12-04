enum Status {
  ACTIVE,
  DELETED
}

export default interface Message {
  id?: number;
  user: {
    id?: number,
    name: string,
    status: number,
    bgColor?: string;
  };
  message: string;
  status?: Status;
  createdAt?: Date;
}
